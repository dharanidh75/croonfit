from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timezone
from decimal import Decimal

from app.database import get_db
from app.models.discount import Discount, DiscountType
from app.schemas.discount import DiscountValidateRequest, DiscountValidateResponse
from app.core.limiter import limiter

router = APIRouter()

@router.post("/validate", response_model=DiscountValidateResponse)
@limiter.limit("20/minute")
def validate_discount(request: Request, req: DiscountValidateRequest, db: Session = Depends(get_db)):
    discount = db.query(Discount).filter(func.upper(Discount.code) == req.code.upper()).first()
    
    if not discount:
        raise HTTPException(status_code=404, detail="Discount code not found")
        
    if not discount.is_active:
        raise HTTPException(status_code=400, detail="Discount code is not active")
        
    if discount.expires_at and discount.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Discount code has expired")
        
    if discount.usage_cap is not None and discount.current_usage >= discount.usage_cap:
        raise HTTPException(status_code=400, detail="Discount code usage cap reached")

    subtotal = Decimal(str(req.subtotal))
    discount_amount = Decimal("0.0")

    if discount.type == DiscountType.PERCENTAGE:
        discount_amount = subtotal * (Decimal(str(discount.percentage_off)) / Decimal("100.0"))
    elif discount.type == DiscountType.FIXED_AMOUNT:
        discount_amount = min(Decimal(str(discount.fixed_amount_off)), subtotal)
    elif discount.type == DiscountType.FREE_SHIPPING:
        # For free shipping, we don't know the exact shipping cost here if it's dynamic, 
        # but typically it means shipping is 0. We'll return 0 discount amount but TYPE FREE_SHIPPING.
        # The frontend handles displaying "Free Shipping" based on the type.
        pass

    return DiscountValidateResponse(
        valid=True,
        code=discount.code,
        discount_amount=float(discount_amount),
        type=discount.type
    )
