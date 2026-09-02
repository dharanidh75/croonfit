from uuid import UUID
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.models.purchase_order import POStatus

class PurchaseOrderItemCreate(BaseModel):
    variant_id: UUID
    quantity_ordered: int = Field(..., gt=0)

class PurchaseOrderCreate(BaseModel):
    po_number: str
    supplier: Optional[str] = None
    notes: Optional[str] = None
    items: List[PurchaseOrderItemCreate]

class PurchaseOrderItemOut(BaseModel):
    id: UUID
    po_id: UUID
    variant_id: Optional[UUID] = None
    product_name: str
    variant_sku: str
    quantity_ordered: int
    quantity_received: int

    class Config:
        from_attributes = True

class PurchaseOrderOut(BaseModel):
    id: UUID
    po_number: str
    supplier: Optional[str] = None
    status: POStatus
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    received_at: Optional[datetime] = None
    items: List[PurchaseOrderItemOut] = []

    class Config:
        from_attributes = True

class PurchaseOrderListResponse(BaseModel):
    items: List[PurchaseOrderOut]
    total: int
    page: int
    per_page: int
    has_more: bool
