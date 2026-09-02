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
from app.core.firebase_auth import get_current_user
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


from decimal import Decimal

@router.post("", response_model=OrderOut, status_code=201)
def create_order(
    order_in: OrderCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    subtotal = Decimal("0.0")
    order_items = []
    
    variant_ids = sorted(list(set(item.variant_id for item in order_in.items)))
    
    locked_variants = (
        db.query(ProductVariant)
        .filter(ProductVariant.id.in_(variant_ids))
        .with_for_update()
        .all()
    )
    
    variant_map = {v.id: v for v in locked_variants}
    issues = []

    for line in order_in.items:
        variant = variant_map.get(line.variant_id)
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
        elif not variant.product.is_active:
            db.rollback()
            raise HTTPException(
                status_code=400,
                detail=f"Product '{variant.product.name}' is no longer active and cannot be ordered."
            )
        else:
            variant.stock_qty -= line.quantity
            
            line_total = Decimal(str(variant.product.price)) * line.quantity
            subtotal += line_total
            image_url = None
            if variant.product.images and len(variant.product.images) > 0:
                image_url = variant.product.images[0].url

            order_items.append(OrderItem(
                variant_id=variant.id,
                product_name=variant.product.name,
                variant_label=f"{variant.size} / {variant.color}",
                product_image=image_url,
                quantity=line.quantity,
                unit_price=Decimal(str(variant.product.price)),
            ))

    if issues:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail={
                "message": "Some items are out of stock.",
                "issues": [i.model_dump() for i in issues],
            },
        )

    shipping_cost = Decimal("0.0") if subtotal >= Decimal(str(settings.FREE_SHIPPING_THRESHOLD)) else Decimal("99.0")
    total = subtotal + shipping_cost

    order = Order(
        order_number=_generate_order_number(),
        user_id=current_user.id,
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
    order_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    order = (
        db.query(Order)
        .options(joinedload(Order.items))
        .filter(Order.id == order_id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    return order
