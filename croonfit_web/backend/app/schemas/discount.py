from uuid import UUID
from pydantic import BaseModel, Field, root_validator
from typing import Optional, List
from datetime import datetime
from app.models.discount import DiscountType

class DiscountCreate(BaseModel):
    code: str = Field(..., max_length=50)
    type: DiscountType
    percentage_off: Optional[float] = Field(None, gt=0, le=100)
    fixed_amount_off: Optional[float] = Field(None, gt=0)
    usage_cap: Optional[int] = Field(None, gt=0)
    expires_at: Optional[datetime] = None
    is_active: bool = True

    @root_validator(pre=True)
    def check_type_consistency(cls, values):
        t = values.get('type')
        p = values.get('percentage_off')
        f = values.get('fixed_amount_off')
        
        if t == DiscountType.PERCENTAGE:
            if p is None or f is not None:
                raise ValueError("Percentage discount must have percentage_off and no fixed_amount_off")
        elif t == DiscountType.FIXED_AMOUNT:
            if f is None or p is not None:
                raise ValueError("Fixed amount discount must have fixed_amount_off and no percentage_off")
        elif t == DiscountType.FREE_SHIPPING:
            if p is not None or f is not None:
                raise ValueError("Free shipping discount cannot have percentage_off or fixed_amount_off")
        return values

class DiscountUpdate(BaseModel):
    expires_at: Optional[datetime] = None
    usage_cap: Optional[int] = Field(None, gt=0)
    is_active: Optional[bool] = None

class DiscountOut(BaseModel):
    id: UUID
    code: str
    type: DiscountType
    percentage_off: Optional[float]
    fixed_amount_off: Optional[float]
    usage_cap: Optional[int]
    current_usage: int
    expires_at: Optional[datetime]
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DiscountValidateRequest(BaseModel):
    code: str
    subtotal: float

class DiscountValidateResponse(BaseModel):
    valid: bool
    discount_amount: float
    type: DiscountType

class DiscountListResponse(BaseModel):
    items: List[DiscountOut]
    total: int
    page: int
    per_page: int
    has_more: bool
