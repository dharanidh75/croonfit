"""
Dummy payment gateway — simulates a Stripe-like payment flow.
All processing is fake (no real charges). Labelled "Test Mode" in the UI.
Structured identically to a real Stripe integration so swapping is a drop-in replacement.
"""
import uuid
import asyncio
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
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
from typing import List

router = APIRouter()


@router.post("/intent", response_model=PaymentIntentOut)
def create_payment_intent(
    data: PaymentIntentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_optional_user),
):
    """Step 1: Create a fake payment intent. Returns a dummy payment_id."""
    order = db.query(Order).options(joinedload(Order.items)).filter(Order.id == data.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.payment_status == PaymentStatus.PAID:
        raise HTTPException(status_code=400, detail="Order already paid")

    # Generate fake payment intent ID (resembles Stripe's pi_xxx format)
    payment_id = "pi_dummy_" + uuid.uuid4().hex[:20]

    record = PaymentRecord(
        order_id=order.id,
        payment_id=payment_id,
        amount=order.total,
        currency="INR",
        status=PaymentStatus.UNPAID,
    )
    db.add(record)
    db.commit()

    return PaymentIntentOut(
        payment_id=payment_id,
        amount=order.total,
        currency="INR",
        order_id=order.id,
        status="requires_payment_method",
    )


@router.post("/confirm", response_model=PaymentConfirmOut)
def confirm_payment(
    data: PaymentConfirm,
    db: Session = Depends(get_db),
    current_user=Depends(get_optional_user),
):
    """
    Step 2: Confirm payment. 
    - Re-validates stock (race condition guard).
    - Marks order as PAID and deducts stock.
    """
    record = db.query(PaymentRecord).filter(PaymentRecord.payment_id == data.payment_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Payment intent not found")
    if record.status == PaymentStatus.PAID:
        raise HTTPException(status_code=400, detail="Payment already confirmed")

    order = db.query(Order).options(joinedload(Order.items)).filter(Order.id == record.order_id).first()

    # Second stock check (race condition guard)
    issues = []
    for item in order.items:
        variant = db.query(ProductVariant).filter(ProductVariant.id == item.variant_id).with_for_update().first()
        if not variant or variant.stock_qty < item.quantity:
            issues.append({
                "variant_id": item.variant_id,
                "product_name": item.product_name,
                "variant_label": item.variant_label,
                "requested": item.quantity,
                "available": variant.stock_qty if variant else 0,
            })

    if issues:
        raise HTTPException(
            status_code=409,
            detail={"message": "Some items went out of stock during checkout.", "issues": issues},
        )

    # Deduct stock
    for item in order.items:
        variant = db.query(ProductVariant).filter(ProductVariant.id == item.variant_id).first()
        variant.stock_qty -= item.quantity

    # Update payment record
    record.status = PaymentStatus.PAID
    record.card_last4 = data.card_number.replace(" ", "")[-4:]
    record.confirmed_at = datetime.now(timezone.utc)

    # Update order
    order.payment_status = PaymentStatus.PAID
    order.status = OrderStatus.PLACED
    order.status_history.append(OrderStatusHistory(status=OrderStatus.PLACED, note="Payment confirmed"))

    db.commit()

    return PaymentConfirmOut(
        success=True,
        order_number=order.order_number,
        payment_id=record.payment_id,
        message="Payment confirmed. Your order has been placed!",
    )
