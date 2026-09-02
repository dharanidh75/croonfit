from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, text
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

from app.database import get_db
from app.core.firebase_auth import require_admin_claim
from app.models.user import User, UserRole
from app.models.order import Order

router = APIRouter()

class DealerListOut(BaseModel):
    id: str
    company: str
    contact: str
    email: str
    status: str
    total_orders: int
    ytd_spend: float

@router.get("", response_model=List[DealerListOut])
def admin_list_dealers(
    db: Session = Depends(get_db),
    admin=Depends(require_admin_claim)
):
    query = text("""
        SELECT 
            u.id::text, 
            COALESCE(u.company_name, 'Unknown Company') as company,
            COALESCE(u.first_name, '') || ' ' || COALESCE(u.last_name, '') as contact,
            u.email, 
            u.is_active,
            COUNT(o.id) FILTER (WHERE o.status != 'CANCELLED') as total_orders,
            COALESCE(SUM(o.total) FILTER (WHERE o.status != 'CANCELLED'), 0) as ytd_spend
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id 
            AND o.created_at >= date_trunc('year', current_date)
        WHERE u.role = 'WHOLESALER'
        GROUP BY u.id
        ORDER BY u.created_at DESC
    """)
    
    rows = db.execute(query).fetchall()
    
    dealers = []
    for r in rows:
        dealers.append({
            "id": r[0].split("-")[0].upper(), # e.g. short ID like W001
            "company": r[1],
            "contact": r[2].strip() or "Unknown",
            "email": r[3],
            "status": "Approved" if r[4] else "Pending",
            "total_orders": r[5],
            "ytd_spend": float(r[6])
        })
    return dealers

from pydantic import EmailStr

class DealerCreate(BaseModel):
    company: str
    contact: str
    email: EmailStr
    ytd_spend: float = 0
    status: str = 'Pending'

@router.post("", response_model=DealerListOut, status_code=201)
def admin_create_dealer(
    data: DealerCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin_claim)
):
    # Check if email already exists
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="A user with this email already exists.")
    
    import uuid
    name_parts = data.contact.strip().split(' ', 1)
    first_name = name_parts[0]
    last_name = name_parts[1] if len(name_parts) > 1 else ''
    
    # Create user with WHOLESALER role — use a placeholder firebase_uid
    user = User(
        firebase_uid=f"admin-created-{uuid.uuid4().hex}",
        email=data.email,
        first_name=first_name,
        last_name=last_name,
        company_name=data.company,
        role=UserRole.WHOLESALER,
        is_active=(data.status == 'Approved'),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return {
        "id": str(user.id).split("-")[0].upper(),
        "company": user.company_name or data.company,
        "contact": f"{user.first_name} {user.last_name}".strip(),
        "email": user.email,
        "status": "Approved" if user.is_active else "Pending",
        "total_orders": 0,
        "ytd_spend": 0.0,
    }
