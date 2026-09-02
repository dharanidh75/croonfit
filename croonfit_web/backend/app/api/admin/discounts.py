from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.discount import Discount
from app.schemas.discount import DiscountCreate, DiscountUpdate, DiscountOut, DiscountListResponse
from app.core.firebase_auth import require_admin_claim

router = APIRouter()

@router.get("", response_model=DiscountListResponse)
def admin_list_discounts(
    db: Session = Depends(get_db),
    admin=Depends(require_admin_claim),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100)
):
    q = db.query(Discount).order_by(Discount.created_at.desc())
    total = q.count()
    items = q.offset((page - 1) * per_page).limit(per_page).all()
    return DiscountListResponse(
        items=items,
        total=total,
        page=page,
        per_page=per_page,
        has_more=total > page * per_page
    )

@router.get("/{discount_id}", response_model=DiscountOut)
def admin_get_discount(
    discount_id: str,
    db: Session = Depends(get_db),
    admin=Depends(require_admin_claim)
):
    discount = db.query(Discount).filter(Discount.id == discount_id).first()
    if not discount:
        raise HTTPException(status_code=404, detail="Discount not found")
    return discount

@router.post("", response_model=DiscountOut, status_code=201)
def admin_create_discount(
    data: DiscountCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin_claim)
):
    existing = db.query(Discount).filter(Discount.code == data.code).first()
    if existing:
        raise HTTPException(status_code=409, detail="Discount code already exists")
    
    discount = Discount(**data.model_dump())
    db.add(discount)
    db.commit()
    db.refresh(discount)
    return discount

@router.put("/{discount_id}", response_model=DiscountOut)
def admin_update_discount(
    discount_id: str,
    data: DiscountUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin_claim)
):
    discount = db.query(Discount).filter(Discount.id == discount_id).first()
    if not discount:
        raise HTTPException(status_code=404, detail="Discount not found")
        
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(discount, field, value)
        
    db.commit()
    db.refresh(discount)
    return discount

@router.delete("/{discount_id}")
def admin_delete_discount(
    discount_id: str,
    db: Session = Depends(get_db),
    admin=Depends(require_admin_claim)
):
    discount = db.query(Discount).filter(Discount.id == discount_id).first()
    if not discount:
        raise HTTPException(status_code=404, detail="Discount not found")
        
    if discount.current_usage > 0:
        # Instead of deleting, just deactivate
        discount.is_active = False
        db.commit()
        return {"message": "Discount deactivated because it has usage history"}
        
    db.delete(discount)
    db.commit()
    return {"message": "Discount deleted successfully"}
