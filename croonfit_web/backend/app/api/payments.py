import razorpay
import uuid
import os
import asyncio
import logging
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models.order import Order, OrderItem, OrderStatus, PaymentStatus, PaymentRecord, OrderStatusHistory
from app.models.product import ProductVariant
from app.schemas.order import (
    PaymentIntentCreate, PaymentIntentOut,
    PaymentConfirm, PaymentConfirmOut,
    PaymentRecordOut,
    StockValidationIssue,
)
from app.core.firebase_auth import get_optional_user
from app.core.limiter import limiter
from app.config import settings
from typing import List

router = APIRouter()
logger = logging.getLogger(__name__)

RAZORPAY_KEY_ID = settings.RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET = settings.RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET = settings.RAZORPAY_WEBHOOK_SECRET

razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

@router.post("/intent", response_model=PaymentIntentOut)
@limiter.limit("10/minute")
def create_payment_intent(
    request: Request,
    data: PaymentIntentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_optional_user),
):
    order = db.query(Order).options(joinedload(Order.items)).filter(Order.id == data.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.payment_status == PaymentStatus.PAID:
        raise HTTPException(status_code=400, detail="Order already paid")

    # Log masked keys for debugging Render auth failure
    masked_key_id = f"{RAZORPAY_KEY_ID[:10]}...{RAZORPAY_KEY_ID[-4:]}" if len(RAZORPAY_KEY_ID) > 14 else "TOO_SHORT"
    key_secret_len = len(RAZORPAY_KEY_SECRET)
    logger.info(f"Attempting Razorpay order creation. Masked Key ID: {masked_key_id} (length {len(RAZORPAY_KEY_ID)}). Key Secret Length: {key_secret_len}.")
    
    # Create Razorpay order
    razorpay_order_data = {
        "amount": int(order.total * 100),
        "currency": "INR",
        "receipt": order.order_number,
    }
    
    try:
        razorpay_order = razorpay_client.order.create(data=razorpay_order_data)
        razorpay_order_id = razorpay_order["id"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create Razorpay order: {str(e)}")

    record = PaymentRecord(
        order_id=order.id,
        payment_id=f"pi_{uuid.uuid4().hex[:15]}", # Keep a local fallback ID
        razorpay_order_id=razorpay_order_id,
        amount=order.total,
        currency="INR",
        status=PaymentStatus.UNPAID,
    )
    db.add(record)
    db.commit()

    return PaymentIntentOut(
        payment_id=razorpay_order_id, # Frontend will use this as the order_id for checkout
        amount=order.total,
        currency="INR",
        order_id=order.id,
        status="requires_payment_method",
    )


@router.post("/confirm", response_model=PaymentConfirmOut)
@limiter.limit("10/minute")
def confirm_payment(
    request: Request,
    data: PaymentConfirm,
    db: Session = Depends(get_db),
    current_user=Depends(get_optional_user),
):
    razorpay_payment_id = data.razorpay_payment_id
    razorpay_order_id = data.razorpay_order_id
    razorpay_signature = data.razorpay_signature
    
    if not all([razorpay_payment_id, razorpay_order_id, razorpay_signature]):
        raise HTTPException(status_code=400, detail="Missing razorpay payment details")

    try:
        razorpay_client.utility.verify_payment_signature({
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        })
    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid payment signature")

    record = db.query(PaymentRecord).with_for_update().filter(PaymentRecord.razorpay_order_id == razorpay_order_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Payment record not found")
    if record.status == PaymentStatus.PAID:
        raise HTTPException(status_code=400, detail="Payment already confirmed")

    order = db.query(Order).filter(Order.id == record.order_id).first()

    # Update payment record
    record.status = PaymentStatus.PAID
    record.razorpay_payment_id = razorpay_payment_id
    record.razorpay_signature = razorpay_signature
    record.confirmed_at = datetime.now(timezone.utc)

    # Update order
    order.payment_status = PaymentStatus.PAID
    order.status = OrderStatus.PLACED
    order.status_history.append(OrderStatusHistory(status=OrderStatus.PLACED, note="Razorpay payment confirmed"))

    db.commit()

    return PaymentConfirmOut(
        success=True,
        order_number=order.order_number,
        payment_id=razorpay_payment_id,
        message="Payment confirmed. Your order has been placed!",
    )


@router.post("/webhook")
async def razorpay_webhook(request: Request, db: Session = Depends(get_db)):
    body = await request.body()
    signature = request.headers.get("X-Razorpay-Signature")

    if not signature:
        raise HTTPException(status_code=400, detail="Missing signature")

    try:
        razorpay_client.utility.verify_webhook_signature(
            body.decode("utf-8"), signature, RAZORPAY_WEBHOOK_SECRET
        )
    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    data = await request.json()
    event = data.get("event")
    
    if event in ["payment.captured", "order.paid"]:
        try:
            payment_entity = data["payload"]["payment"]["entity"]
            razorpay_order_id = payment_entity.get("order_id")
            razorpay_payment_id = payment_entity.get("id")
        except KeyError:
            return {"status": "ok"}

        if not razorpay_order_id:
            return {"status": "ok"}

        record = db.query(PaymentRecord).with_for_update().filter(PaymentRecord.razorpay_order_id == razorpay_order_id).first()
        if not record:
            return {"status": "ok"}
            
        if record.status == PaymentStatus.UNPAID:
            order = db.query(Order).filter(Order.id == record.order_id).first()
            
            # Update payment record
            record.status = PaymentStatus.PAID
            record.razorpay_payment_id = razorpay_payment_id
            record.confirmed_at = datetime.now(timezone.utc)
            
            # Update order
            order.payment_status = PaymentStatus.PAID
            if order.status == OrderStatus.PENDING:
                order.status = OrderStatus.PLACED
                order.status_history.append(OrderStatusHistory(status=OrderStatus.PLACED, note="Razorpay webhook confirmed"))
                
            db.commit()

    return {"status": "ok"}
