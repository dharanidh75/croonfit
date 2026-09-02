from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, text
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

from app.database import get_db
from app.core.firebase_auth import require_admin_claim
from app.models.user import User, UserAddress
from app.models.order import Order, OrderStatus

router = APIRouter()

# --- Schemas ---
class CustomerListOut(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    joined: datetime
    status: str
    orders: int
    spent: float
    last_active: Optional[datetime] = None

class CustomerOrderHistory(BaseModel):
    id: str
    date: datetime
    status: str
    total: float
    items: int

class CustomerDetailOut(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    joined: datetime
    status: str
    address: str
    order_history: List[CustomerOrderHistory]

# --- Endpoints ---

@router.get("", response_model=List[CustomerListOut])
def admin_list_customers(
    db: Session = Depends(get_db),
    admin=Depends(require_admin_claim)
):
    query = text("""
        SELECT 
            u.id::text, 
            COALESCE(u.first_name, '') || ' ' || COALESCE(u.last_name, '') as name,
            u.email, 
            u.phone, 
            u.created_at as joined, 
            u.is_active,
            COUNT(o.id) FILTER (WHERE o.status != 'CANCELLED') as orders,
            COALESCE(SUM(o.total) FILTER (WHERE o.status != 'CANCELLED'), 0) as spent,
            MAX(o.created_at) as last_active
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id
        GROUP BY u.id
        ORDER BY u.created_at DESC
    """)
    
    rows = db.execute(query).fetchall()
    
    customers = []
    for r in rows:
        customers.append({
            "id": r[0],
            "name": r[1].strip() or "Unknown",
            "email": r[2],
            "phone": r[3],
            "joined": r[4],
            "status": "Active" if r[5] else "Inactive",
            "orders": r[6],
            "spent": float(r[7]),
            "last_active": r[8]
        })
    return customers


@router.get("/{customer_id}", response_model=CustomerDetailOut)
def admin_get_customer(
    customer_id: str,
    db: Session = Depends(get_db),
    admin=Depends(require_admin_claim)
):
    user = db.query(User).filter(User.id == customer_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Customer not found")

    name = f"{user.first_name or ''} {user.last_name or ''}".strip() or "Unknown"
    
    # Address logic
    addresses = db.query(UserAddress).filter(UserAddress.user_id == user.id).all()
    default_address = next((a for a in addresses if a.is_default), None)
    if not default_address and addresses:
        default_address = addresses[0]
        
    address_str = "No address provided"
    if default_address:
        parts = [default_address.street, default_address.city, default_address.state, default_address.zip, default_address.country]
        address_str = ", ".join(p for p in parts if p)

    from sqlalchemy.orm import joinedload
    orders = db.query(Order).options(joinedload(Order.items)).filter(Order.user_id == user.id).order_by(Order.created_at.desc()).all()
    
    history = []
    for o in orders:
        history.append({
            "id": o.order_number,
            "date": o.created_at,
            "status": o.status.value if hasattr(o.status, 'value') else str(o.status),
            "total": float(o.total),
            "items": len(o.items) if getattr(o, 'items', None) else 0 # Though we didn't eager load items, we could, but UI just needs items count or we can just mock items if not strictly needed. Actually, let's just do len(o.items) which will trigger a lazy load, it's fine for a single customer. Wait, it's better to eager load.
        })

    return {
        "id": str(user.id),
        "name": name,
        "email": user.email,
        "phone": user.phone,
        "joined": user.created_at,
        "status": "Active" if user.is_active else "Inactive",
        "address": address_str,
        "order_history": history
    }
