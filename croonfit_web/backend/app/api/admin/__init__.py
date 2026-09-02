from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from app.database import get_db

from app.models.product import Product, ProductVariant, ProductImage, Category
from app.models.order import Order, OrderStatusHistory, PaymentRecord, OrderStatus
from app.schemas.user import AdminLogin, AdminToken
from app.schemas.order import OrderOut, OrderStatusUpdate, PaymentRecordOut
from app.core.firebase_auth import require_admin_claim

from app.api.admin import products, purchase_orders, inventory

router = APIRouter()

router.include_router(products.router, prefix="/products", tags=["admin_products"])
router.include_router(purchase_orders.router, prefix="/purchase-orders", tags=["admin_purchase_orders"])
router.include_router(inventory.router, prefix="/inventory", tags=["admin_inventory"])
# ─── Admin: Orders ────────────────────────────────────────────────────────────

@router.get("/orders", response_model=List[OrderOut])
def admin_list_orders(
    db: Session = Depends(get_db),
    admin=Depends(require_admin_claim),
    status: Optional[OrderStatus] = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
):
    q = db.query(Order).options(joinedload(Order.items))
    if status:
        q = q.filter(Order.status == status)
    q = q.order_by(Order.created_at.desc())
    return q.offset((page - 1) * per_page).limit(per_page).all()


@router.get("/orders/{order_id}", response_model=OrderOut)
def admin_get_order(
    order_id: str,
    db: Session = Depends(get_db),
    admin=Depends(require_admin_claim),
):
    order = db.query(Order).options(joinedload(Order.items)).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.patch("/orders/{order_id}/status", response_model=OrderOut)
def admin_update_order_status(
    order_id: str,
    data: OrderStatusUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin_claim),
):
    order = db.query(Order).options(joinedload(Order.items)).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = data.status
    order.status_history.append(OrderStatusHistory(status=data.status, note=data.note))
    db.commit()
    db.refresh(order)
    return order


# ─── Admin: Billing (Payments Ledger) ────────────────────────────────────────

@router.get("/billing", response_model=List[PaymentRecordOut])
def admin_billing(
    db: Session = Depends(get_db),
    admin=Depends(require_admin_claim),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
):
    return (
        db.query(PaymentRecord)
        .order_by(PaymentRecord.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )


# ─── Admin: Dashboard Stats ───────────────────────────────────────────────────

@router.get("/stats")
def admin_stats(
    db: Session = Depends(get_db),
    admin=Depends(require_admin_claim),
):
    from sqlalchemy import func
    from app.models.order import PaymentStatus
    total_orders = db.query(Order).count()
    pending = db.query(Order).filter(Order.status == OrderStatus.PENDING).count()
    placed = db.query(Order).filter(Order.status == OrderStatus.PLACED).count()
    shipped = db.query(Order).filter(Order.status == OrderStatus.SHIPPED).count()
    delivered = db.query(Order).filter(Order.status == OrderStatus.DELIVERED).count()
    cancelled = db.query(Order).filter(Order.status == OrderStatus.CANCELLED).count()
    revenue = db.query(func.sum(PaymentRecord.amount)).filter(
        PaymentRecord.status == PaymentStatus.PAID
    ).scalar() or 0.0

    from app.models.product import ProductVariant
    low_stock = (
        db.query(ProductVariant)
        .options(joinedload(ProductVariant.product))
        .filter(ProductVariant.stock_qty <= 5, ProductVariant.stock_qty > 0)
        .all()
    )

    return {
        "orders": {
            "total": total_orders, "pending": pending, "placed": placed,
            "shipped": shipped, "delivered": delivered, "cancelled": cancelled,
        },
        "revenue": revenue,
        "low_stock_variants": [
            {
                "sku": v.sku, "product": v.product.name,
                "size": v.size, "color": v.color, "qty": v.stock_qty,
            }
            for v in low_stock
        ],
    }


# ─── Admin: Categories CRUD ───────────────────────────────────────────────────

from app.schemas.product import CategoryCreate, CategoryUpdate, CategoryOut

@router.get("/categories", response_model=List[CategoryOut])
def admin_list_categories(
    db: Session = Depends(get_db),
    admin=Depends(require_admin_claim),
):
    return db.query(Category).options(joinedload(Category.products)).all()


@router.post("/categories", response_model=CategoryOut, status_code=201)
def admin_create_category(
    data: CategoryCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin_claim),
):
    existing = db.query(Category).filter(Category.slug == data.slug).first()
    if existing:
        raise HTTPException(status_code=409, detail="Category with this slug already exists")
    cat = Category(**data.model_dump())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


@router.put("/categories/{category_id}", response_model=CategoryOut)
def admin_update_category(
    category_id: str,
    data: CategoryUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin_claim),
):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(cat, field, value)
    db.commit()
    db.refresh(cat)
    return cat


@router.delete("/categories/{category_id}")
def admin_delete_category(
    category_id: str,
    db: Session = Depends(get_db),
    admin=Depends(require_admin_claim),
):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    if cat.products:
        raise HTTPException(status_code=409, detail="Cannot delete category with existing products. Move products first.")
    db.delete(cat)
    db.commit()
    return {"message": "Category deleted"}
