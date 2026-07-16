from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime
from app.models.product import GenderCategory


# ─── SizeChart ───────────────────────────────────────────────────────────────

class SizeChartOut(BaseModel):
    id: int
    category_id: int
    rows: List[Any]  # [{size, chest_cm, length_cm, sleeve_cm, shoulder_cm, fit_note}]

    class Config:
        from_attributes = True


# ─── Category ────────────────────────────────────────────────────────────────

class CategoryOut(BaseModel):
    id: int
    name: str
    slug: str
    gender: GenderCategory
    description: Optional[str] = None
    cover_image_url: Optional[str] = None
    size_chart: Optional[SizeChartOut] = None

    class Config:
        from_attributes = True


# ─── ProductImage ─────────────────────────────────────────────────────────────

class ProductImageOut(BaseModel):
    id: int
    url: str
    alt: Optional[str] = None
    is_primary: bool
    sort_order: int

    class Config:
        from_attributes = True


# ─── ProductVariant ───────────────────────────────────────────────────────────

class ProductVariantOut(BaseModel):
    id: int
    size: str
    color: str
    color_hex: Optional[str] = None
    stock_qty: int
    sku: str

    class Config:
        from_attributes = True


class ProductVariantCreate(BaseModel):
    size: str
    color: str
    color_hex: Optional[str] = None
    stock_qty: int = 0
    sku: str


# ─── Product ─────────────────────────────────────────────────────────────────

class ProductOut(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    price: float
    compare_price: Optional[float] = None
    category_id: int
    is_active: bool
    is_featured: bool
    tags: Optional[List[str]] = None
    created_at: Optional[datetime] = None
    images: List[ProductImageOut] = []
    variants: List[ProductVariantOut] = []
    category: Optional[CategoryOut] = None

    class Config:
        from_attributes = True


class ProductListItem(BaseModel):
    """Lighter response for shop grid — no variants, just primary image."""
    id: int
    name: str
    slug: str
    price: float
    compare_price: Optional[float] = None
    is_featured: bool
    tags: Optional[List[str]] = None
    primary_image: Optional[str] = None   # populated in service
    secondary_image: Optional[str] = None  # for card hover crossfade
    category: Optional[CategoryOut] = None
    available_sizes: List[str] = []

    class Config:
        from_attributes = True


class ProductImageCreate(BaseModel):
    url: str
    alt: Optional[str] = None
    is_primary: bool = False
    sort_order: int = 0

class ProductCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    price: float
    compare_price: Optional[float] = None
    category_id: int
    is_active: bool = True
    is_featured: bool = False
    tags: Optional[List[str]] = None
    variants: List[ProductVariantCreate] = []
    images: List[ProductImageCreate] = []


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    compare_price: Optional[float] = None
    category_id: Optional[int] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    tags: Optional[List[str]] = None


class ProductListResponse(BaseModel):
    items: List[ProductListItem]
    total: int
    page: int
    per_page: int
    has_more: bool

# ─── Category CRUD ───────────────────────────────────────────────────────────

class CategoryCreate(BaseModel):
    name: str
    slug: str
    gender: GenderCategory
    description: str | None = None
    cover_image_url: str | None = None


class CategoryUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    gender: GenderCategory | None = None
    description: str | None = None
    cover_image_url: str | None = None
