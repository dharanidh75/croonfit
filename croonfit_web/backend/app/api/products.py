from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from app.database import get_db
from app.models.product import GenderCategory
from app.schemas.product import (
    ProductPublicDetail, ProductPublicListItem, ProductListResponse
)
from app.services.product_service import ProductService

router = APIRouter()

@router.get("", response_model=ProductListResponse)
def list_products(
    db: Session = Depends(get_db),
    category: Optional[str] = Query(None, description="Category slug"),
    gender: Optional[GenderCategory] = Query(None),
    size: Optional[str] = Query(None),
    color: Optional[str] = Query(None),
    price_min: Optional[float] = Query(None),
    price_max: Optional[float] = Query(None),
    sort: Optional[str] = Query("newest", regex="^(newest|price_asc|price_desc|popular)$"),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(12, ge=1, le=48),
):
    items, total = ProductService.list_public_products(
        db=db,
        category=category,
        gender=gender,
        size=size,
        color=color,
        price_min=price_min,
        price_max=price_max,
        sort=sort,
        search=search,
        page=page,
        per_page=per_page
    )
    
    return ProductListResponse(
        items=items,
        total=total,
        page=page,
        per_page=per_page,
        has_more=(page * per_page) < total,
    )

@router.get("/featured", response_model=List[ProductPublicListItem])
def get_featured(
    db: Session = Depends(get_db), 
    limit: int = Query(8, le=20)
):
    return ProductService.get_featured_products(db, limit)

@router.get("/categories", response_model=List[dict])
def get_categories(db: Session = Depends(get_db)):
    categories = ProductService.get_categories(db)
    return [{"id": str(c.id), "name": c.name, "slug": c.slug, "gender": c.gender, "cover_image_url": c.cover_image_url} for c in categories]

@router.get("/{slug}", response_model=ProductPublicDetail)
def get_product(slug: str, db: Session = Depends(get_db)):
    return ProductService.get_public_product(db, slug)
