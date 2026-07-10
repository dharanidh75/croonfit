import random
import string
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from app.database import get_db
from app.models.order import Order, OrderItem, OrderStatus, OrderStatusHistory
from app.models.product import ProductVariant, Product
from app.schemas.order import (
    OrderCreate, OrderOut,
    StockValidationRequest, StockValidationResponse, StockValidationIssue,
)
from app.core.security import get_current_user, get_optional_user
from app.config import settings


router = APIRouter()


def _generate_order_number() -> str:
    return "CF-" + "".join(random.choices(string.digits, k=8))


def _validate_stock_items(items, db: Session) -> StockValidationResponse:
    issues = []
    for line in items:
        variant = (
            db.query(ProductVariant)
            .options(joinedload(ProductVariant.product))
            .filter(ProductVariant.id == line.variant_id)
            .first()
        )
        if not variant:
            issues.append(StockValidationIssue(
                variant_id=line.variant_id,
                requested=line.quantity,
                available=0,
                product_name="Unknown",
                variant_label="Unknown",
            ))
        elif variant.stock_qty < line.quantity:
            issues.append(StockValidationIssue(
                variant_id=line.variant_id,
                requested=line.quantity,
                available=variant.stock_qty,
                product_name=variant.product.name,
                variant_label=f"{variant.size} / {variant.color}",
            ))
    return StockValidationResponse(valid=len(issues) == 0, issues=issues)


@router.post("/validate-stock", response_model=StockValidationResponse)
def validate_stock(req: StockValidationRequest, db: Session = Depends(get_db)):
    """Pre-checkout stock check. Called before payment intent creation."""
    return _validate_stock_items(req.items, db)


@router.post("", response_model=OrderOut, status_code=201)
def create_order(
    order_in: OrderCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_optional_user),
):
    # Stock validation — first check
    validation = _validate_stock_items(order_in.items, db)
    if not validation.valid:
        raise HTTPException(
            status_code=409,
            detail={
                "message": "Some items are out of stock.",
                "issues": [i.model_dump() for i in validation.issues],
            },
        )

    subtotal = 0.0
    order_items = []

    for line in order_in.items:
        variant = (
            db.query(ProductVariant)
            .options(joinedload(ProductVariant.product))
            .filter(ProductVariant.id == line.variant_id)
            .first()
        )
        line_total = variant.product.price * line.quantity
        subtotal += line_total
        order_items.append(OrderItem(
            variant_id=variant.id,
            product_name=variant.product.name,
            variant_label=f"{variant.size} / {variant.color}",
            quantity=line.quantity,
            unit_price=variant.product.price,
        ))

    shipping_cost = 0.0 if subtotal >= settings.FREE_SHIPPING_THRESHOLD else 99.0
    total = subtotal + shipping_cost

    order = Order(
        order_number=_generate_order_number(),
        user_id=current_user.id if current_user else None,
        subtotal=subtotal,
        shipping_cost=shipping_cost,
        total=total,
        shipping_address=order_in.shipping_address.model_dump(),
        notes=order_in.notes,
        items=order_items,
    )
    order.status_history = [OrderStatusHistory(status=OrderStatus.PENDING)]
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


@router.get("/me", response_model=List[OrderOut])
def get_my_orders(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return (
        db.query(Order)
        .options(joinedload(Order.items))
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )


@router.get("/{order_id}", response_model=OrderOut)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_optional_user),
):
    order = (
        db.query(Order)
        .options(joinedload(Order.items))
        .filter(Order.id == order_id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    # Guests can only view if they have no user_id on the order
    if current_user and order.user_id and order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return order
