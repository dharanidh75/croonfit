from uuid import UUID
from pydantic import BaseModel
from typing import Optional, List

class InventoryVariantOut(BaseModel):
    id: UUID
    name: str  # size/color label
    sku: str
    stock: int
    available: int
    sold: int
    status: str

class InventoryProductOut(BaseModel):
    id: UUID
    name: str
    category: str
    primary_image: Optional[str] = None
    totalStock: int
    available: int
    sold: int
    status: str
    variants: List[InventoryVariantOut]

class InventoryLowStockItem(BaseModel):
    sku: str
    product: str
    size: str
    color: str
    qty: int

class InventorySummary(BaseModel):
    total_value: float
    low_stock_variants: int
    incoming: int

class InventoryDashboardResponse(BaseModel):
    items: List[InventoryProductOut]
    summary: InventorySummary
