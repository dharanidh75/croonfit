from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
import uuid

from app.database import get_db
from app.models.shopping import Cart, CartItem
from app.models.product import ProductVariant, Product
from app.core.firebase_auth import get_current_user

router = APIRouter()

class MergeCartItem(BaseModel):
    variant_id: str
    quantity: int

class MergeCartRequest(BaseModel):
    items: List[MergeCartItem]

class CartItemOut(BaseModel):
    product: dict
    variant: dict
    quantity: int

class MergeCartResponse(BaseModel):
    merged_items: List[CartItemOut]
    messages: List[str]

@router.post("/merge", response_model=MergeCartResponse)
def merge_cart(
    request: MergeCartRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    messages = []
    
    # Get or create user's cart
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart:
        cart = Cart(id=uuid.uuid4(), user_id=current_user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
        
    # Build a map of existing cart items
    existing_items = {item.variant_id: item for item in cart.items}
    
    for req_item in request.items:
        # Validate variant exists
        variant = db.query(ProductVariant).filter(ProductVariant.id == req_item.variant_id).first()
        if not variant:
            continue
            
        if req_item.variant_id in existing_items:
            # Update existing
            cart_item = existing_items[req_item.variant_id]
            new_qty = cart_item.quantity + req_item.quantity
            
            # Clamp to stock
            if new_qty > variant.stock_qty:
                messages.append(f"Only {variant.stock_qty} available for {variant.product.name} ({variant.size}), adjusted from {new_qty}.")
                new_qty = variant.stock_qty
                
            cart_item.quantity = new_qty
        else:
            # Insert new
            new_qty = req_item.quantity
            if new_qty > variant.stock_qty:
                messages.append(f"Only {variant.stock_qty} available for {variant.product.name} ({variant.size}), adjusted from {new_qty}.")
                new_qty = variant.stock_qty
                
            new_item = CartItem(
                id=uuid.uuid4(),
                cart_id=cart.id,
                variant_id=req_item.variant_id,
                quantity=new_qty
            )
            db.add(new_item)
            existing_items[req_item.variant_id] = new_item
            
    db.commit()
    db.refresh(cart)
    
    # Now build the response to return the merged cart so frontend can update its Zustand state
    # Wait, frontend expects { product: {...}, variant: {...}, quantity }
    merged_items = []
    for item in cart.items:
        v = db.query(ProductVariant).filter(ProductVariant.id == item.variant_id).first()
        if v:
            p = v.product
            # Serialize for frontend
            merged_items.append({
                "product": {
                    "id": str(p.id),
                    "name": p.name,
                    "slug": p.slug,
                    "price": float(p.price),
                    "compare_price": float(p.compare_price) if p.compare_price else None,
                    "thumbnail_url": p.thumbnail_url
                },
                "variant": {
                    "id": str(v.id),
                    "size": v.size,
                    "color": v.color,
                    "color_hex": v.color_hex,
                    "price": float(v.price) if v.price else float(p.price),
                    "stock_qty": v.stock_qty
                },
                "quantity": item.quantity
            })
            
    return MergeCartResponse(merged_items=merged_items, messages=messages)
