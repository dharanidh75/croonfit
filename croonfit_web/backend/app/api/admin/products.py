from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.firebase_auth import require_admin_claim
from app.services.product_service import ProductService
from app.schemas.product import (
    ProductCreate, ProductUpdate, 
    ProductAdminDetail, AdminProductListResponse
)

router = APIRouter()

@router.get("", response_model=AdminProductListResponse)
def admin_list_products(
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin_claim),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    search: str = Query(None),
):
    items, total = ProductService.list_admin_products(db, page, per_page, search)
    return AdminProductListResponse(
        items=items,
        total=total,
        page=page,
        per_page=per_page,
        has_more=(page * per_page) < total,
    )

@router.get("/{product_id}", response_model=ProductAdminDetail)
def admin_get_product(
    product_id: str,
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin_claim),
):
    return ProductService.get_admin_product(db, product_id)

@router.post("", response_model=ProductAdminDetail, status_code=201)
def admin_create_product(
    data: ProductCreate,
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin_claim),
):
    return ProductService.create_product(db, data)

@router.put("/{product_id}", response_model=ProductAdminDetail)
def admin_update_product(
    product_id: str,
    data: ProductUpdate,
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin_claim),
):
    return ProductService.update_product(db, product_id, data)

@router.delete("/{product_id}")
def admin_delete_product(
    product_id: str,
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin_claim),
):
    ProductService.delete_product(db, product_id)
    return {"message": "Product deleted successfully"}

@router.delete("/{product_id}/variants/{variant_id}")
def admin_delete_variant(
    product_id: str,
    variant_id: str,
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin_claim),
):
    ProductService.delete_variant(db, product_id, variant_id)
    return {"message": "Variant deleted successfully"}
