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
