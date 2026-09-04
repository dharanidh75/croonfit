from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from app.database import get_db
from app.models.shopping import Wishlist as WishlistItem
from app.models.product import Product, VariantImage
from app.schemas.product import ProductPublicListItem
from app.core.firebase_auth import get_current_user
from app.services.product_service import ProductService

router = APIRouter()


@router.get("", response_model=List[ProductPublicListItem])
def get_wishlist(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    items = (
        db.query(WishlistItem)
        .filter(WishlistItem.user_id == current_user.id)
        .all()
    )
    product_ids = [i.product_id for i in items]
    products = (
        db.query(Product)
        .options(
            joinedload(Product.images),
            joinedload(Product.variants),
            joinedload(Product.category),
        )
        .filter(Product.id.in_(product_ids), Product.is_active == True)
        .all()
    )
    return [ProductService._build_public_list_item(p) for p in products]


@router.post("/{product_id}", status_code=201)
def add_to_wishlist(
    product_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    product = db.query(Product).filter(Product.id == product_id, Product.is_active == True).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = db.query(WishlistItem).filter(
        WishlistItem.user_id == current_user.id,
        WishlistItem.product_id == product_id,
    ).first()
    if existing:
        return {"message": "Already in wishlist"}

    item = WishlistItem(user_id=current_user.id, product_id=product_id)
    db.add(item)
    db.commit()
    return {"message": "Added to wishlist"}


@router.delete("/{product_id}", status_code=200)
def remove_from_wishlist(
    product_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    item = db.query(WishlistItem).filter(
        WishlistItem.user_id == current_user.id,
        WishlistItem.product_id == product_id,
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Not in wishlist")
    db.delete(item)
    db.commit()
    return {"message": "Removed from wishlist"}
