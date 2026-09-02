from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from app.database import get_db

from app.models.product import Product, ProductVariant, ProductImage, Category
from app.models.order import Order, OrderStatusHistory, PaymentRecord, OrderStatus
from app.schemas.user import AdminLogin, AdminToken
from app.schemas.order import OrderOut, OrderStatusUpdate, PaymentRecordOut
from app.core.firebase_auth import require_admin_claim

from app.api.admin import products, purchase_orders, inventory, discounts, customers, dealers

router = APIRouter()

router.include_router(products.router, prefix="/products", tags=["admin_products"])
router.include_router(purchase_orders.router, prefix="/purchase-orders", tags=["admin_purchase_orders"])
router.include_router(inventory.router, prefix="/inventory", tags=["admin_inventory"])
router.include_router(discounts.router, prefix="/discounts", tags=["admin_discounts"])
router.include_router(customers.router, prefix="/customers", tags=["admin_customers"])
router.include_router(dealers.router, prefix="/dealers", tags=["admin_dealers"])
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
    from app.models.discount import DiscountRedemption
    order = (
        db.query(Order)
        .options(joinedload(Order.items), joinedload(Order.discount_redemption).joinedload(DiscountRedemption.discount))
        .filter(Order.id == order_id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Handle discount reversal on cancellation
    if data.status == OrderStatus.CANCELLED and order.status != OrderStatus.CANCELLED:
        redemption = order.discount_redemption
        if redemption and not redemption.is_reversed:
            # Re-fetch discount with row lock to decrement safely
            from app.models.discount import Discount
            discount = db.query(Discount).filter(Discount.id == redemption.discount_id).with_for_update().first()
            if discount and discount.current_usage > 0:
                discount.current_usage -= 1
            redemption.is_reversed = True

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
    from sqlalchemy import func, text
    from app.models.order import PaymentStatus, OrderStatus

    total_orders = db.query(Order).count()
    pending = db.query(Order).filter(Order.status == OrderStatus.PENDING).count()
    placed = db.query(Order).filter(Order.status == OrderStatus.PLACED).count()
    shipped = db.query(Order).filter(Order.status == OrderStatus.SHIPPED).count()
    delivered = db.query(Order).filter(Order.status == OrderStatus.DELIVERED).count()
    cancelled = db.query(Order).filter(Order.status == OrderStatus.CANCELLED).count()
    revenue = db.query(func.sum(Order.total)).filter(
        Order.status != OrderStatus.CANCELLED
    ).scalar() or 0.0

    from app.models.product import ProductVariant
    low_stock = (
        db.query(ProductVariant)
        .options(joinedload(ProductVariant.product))
        .filter(ProductVariant.stock_qty <= 5, ProductVariant.stock_qty > 0)
        .all()
    )

    # 1. Active Customers (last 90 days)
    active_customers = db.execute(text("""
        SELECT COUNT(DISTINCT user_id)
        FROM orders
        WHERE status != 'CANCELLED'
          AND created_at >= NOW() - INTERVAL '90 days'
    """)).scalar() or 0

    # 2. Revenue Chart (last 8 months)
    from datetime import datetime, date
    import calendar
    today = date.today()
    revenue_by_month = {}
    months_order = []
    
    for i in range(7, -1, -1):
        m = today.month - i
        y = today.year
        while m <= 0:
            m += 12
            y -= 1
        month_name = calendar.month_abbr[m]
        months_order.append((y, m, month_name))
        revenue_by_month[f"{y}-{m:02d}"] = {"name": month_name, "revenue": 0.0}

    chart_data = db.execute(text("""
        SELECT to_char(date_trunc('month', created_at), 'YYYY-MM') as month_key, 
               SUM(total) as revenue
        FROM orders
        WHERE status != 'CANCELLED'
          AND created_at >= date_trunc('month', current_date - interval '7 months')
        GROUP BY 1
    """)).fetchall()

    for row in chart_data:
        m_key = row[0]
        if m_key in revenue_by_month:
            revenue_by_month[m_key]["revenue"] = float(row[1])
            
    revenue_chart = [
        {"label": revenue_by_month[f"{y}-{m:02d}"]["name"], "value": revenue_by_month[f"{y}-{m:02d}"]["revenue"]} 
        for y, m, name in months_order
    ]

    # 3. Trends (Current Calendar Month vs Previous Calendar Month)
    current_month_stats = db.execute(text("""
        SELECT COALESCE(SUM(total), 0) as rev, COUNT(*) as cnt
        FROM orders
        WHERE status != 'CANCELLED'
          AND created_at >= date_trunc('month', current_date)
    """)).fetchone()
    
    prev_month_stats = db.execute(text("""
        SELECT COALESCE(SUM(total), 0) as rev, COUNT(*) as cnt
        FROM orders
        WHERE status != 'CANCELLED'
          AND created_at >= date_trunc('month', current_date - interval '1 month')
          AND created_at < date_trunc('month', current_date)
    """)).fetchone()

    def calc_trend(curr, prev):
        if prev == 0:
            return 100.0 if curr > 0 else 0.0
        return float(((curr - prev) / prev) * 100)

    trends = {
        "revenue": calc_trend(current_month_stats[0], prev_month_stats[0]),
        "orders": calc_trend(current_month_stats[1], prev_month_stats[1])
    }

    # 4. Recent Activity (OrderStatusHistory)
    activities = db.execute(text("""
        SELECT o.order_number, h.status, h.changed_at
        FROM order_status_history h
        JOIN orders o ON h.order_id = o.id
        ORDER BY h.changed_at DESC
        LIMIT 5
    """)).fetchall()
    
    recent_activity = []
    for row in activities:
        recent_activity.append({
            "text": f"Order #{row[0]} \u2192 {row[1]}",
            "time": row[2].isoformat()
        })

    # 5. Recent Sales (Orders)
    recent_sales_rows = db.query(Order).order_by(Order.created_at.desc()).limit(5).all()
    recent_sales = []
    for o in recent_sales_rows:
        customer = o.shipping_address.get('full_name', 'Unknown') if o.shipping_address else 'Unknown'
        recent_sales.append({
            "id": o.order_number,
            "customer": customer,
            "total": float(o.total),
            "status": o.status,
            "date": o.created_at.isoformat()
        })

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
        "active_customers": active_customers,
        "revenue_chart": revenue_chart,
        "trends": trends,
        "recent_activity": recent_activity,
        "recent_sales": recent_sales
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
