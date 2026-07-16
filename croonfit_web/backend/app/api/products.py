from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from typing import Optional, List
from app.database import get_db
from app.models.product import Product, ProductVariant, ProductImage, Category, GenderCategory
from app.schemas.product import (
    ProductOut, ProductListItem, ProductListResponse,
    ProductCreate, ProductUpdate,
)
from app.core.security import get_current_user

router = APIRouter()


def _build_list_item(p: Product) -> ProductListItem:
    primary = next((img.url for img in p.images if img.is_primary), None)
    if not primary and p.images:
        primary = p.images[0].url
    secondary = next((img.url for img in p.images if not img.is_primary), None)
    sizes = sorted({v.size for v in p.variants if v.stock_qty > 0})
    return ProductListItem(
        id=p.id,
        name=p.name,
        slug=p.slug,
        price=p.price,
        compare_price=p.compare_price,
        is_featured=p.is_featured,
        tags=p.tags,
        primary_image=primary,
        secondary_image=secondary,
        category=p.category,
        available_sizes=sizes,
    )


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
    q = (
        db.query(Product)
        .options(
            joinedload(Product.images),
            joinedload(Product.variants),
            joinedload(Product.category),
        )
        .filter(Product.is_active == True)
    )

    if category or gender:
        q = q.join(Product.category)
        if category:
            q = q.filter(Category.slug == category)
        if gender:
            q = q.filter(Category.gender == gender)
    if price_min is not None:
        q = q.filter(Product.price >= price_min)
    if price_max is not None:
        q = q.filter(Product.price <= price_max)
    if search:
        q = q.filter(
            or_(Product.name.ilike(f"%{search}%"), Product.description.ilike(f"%{search}%"))
        )
    if size:
        q = q.join(Product.variants).filter(
            ProductVariant.size == size, ProductVariant.stock_qty > 0
        )
    if color:
        q = q.join(Product.variants).filter(ProductVariant.color.ilike(f"%{color}%"))

    # Sorting
    if sort == "price_asc":
        q = q.order_by(Product.price.asc())
    elif sort == "price_desc":
        q = q.order_by(Product.price.desc())
    else:  # newest / popular (featured first, then by created_at)
        q = q.order_by(Product.is_featured.desc(), Product.created_at.desc())

    total = q.count()
    products = q.offset((page - 1) * per_page).limit(per_page).all()

    return ProductListResponse(
        items=[_build_list_item(p) for p in products],
        total=total,
        page=page,
        per_page=per_page,
        has_more=(page * per_page) < total,
    )


@router.get("/featured", response_model=List[ProductListItem])
def get_featured(db: Session = Depends(get_db), limit: int = Query(8, le=20)):
    products = (
        db.query(Product)
        .options(joinedload(Product.images), joinedload(Product.variants), joinedload(Product.category))
        .filter(Product.is_active == True, Product.is_featured == True)
        .order_by(Product.created_at.desc())
        .limit(limit)
        .all()
    )
    return [_build_list_item(p) for p in products]


@router.get("/categories", response_model=List[dict])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    return [{"id": c.id, "name": c.name, "slug": c.slug, "gender": c.gender} for c in categories]


@router.get("/{slug}", response_model=ProductOut)
def get_product(slug: str, db: Session = Depends(get_db)):
    product = (
        db.query(Product)
        .options(
            joinedload(Product.images),
            joinedload(Product.variants),
            joinedload(Product.category).joinedload(Category.size_chart),
        )
        .filter(Product.slug == slug, Product.is_active == True)
        .first()
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
