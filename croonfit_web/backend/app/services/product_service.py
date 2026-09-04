from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import Optional
from app.repositories.product_repository import ProductRepository
from app.schemas.product import (
    ProductCreate, ProductUpdate, 
    ProductAdminListItem, ProductPublicListItem
)
from app.models.product import Product, ProductVariant, VariantImage
from app.models.order import OrderStatus

class ProductService:
    
    # Active orders statuses that block variant/product deletion
    ACTIVE_ORDER_STATUSES = [OrderStatus.PENDING.value, OrderStatus.PLACED.value, OrderStatus.SHIPPED.value]

    @staticmethod
    def _build_admin_list_item(p: Product) -> ProductAdminListItem:
        primary_image = p.thumbnail_url
            
        stock = sum(v.stock_qty for v in p.variants) if p.variants else 0
        
        if not p.variants:
            sku = "—"
        elif len(p.variants) > 1:
            sku = "Multiple"
        else:
            sku = p.variants[0].sku

        return ProductAdminListItem(
            id=p.id,
            name=p.name,
            sku=sku,
            price=p.price,
            stock=stock,
            is_active=p.is_active,
            category_name=p.category.name if p.category else None,
            thumbnail_url=primary_image,
        )

    @staticmethod
    def _build_public_list_item(p: Product) -> ProductPublicListItem:
        primary = p.thumbnail_url
        secondary = None
        sizes = sorted({v.size for v in p.variants if v.stock_qty > 0}) if p.variants else []
        return ProductPublicListItem(
            id=p.id,
            name=p.name,
            slug=p.slug,
            price=p.price,
            compare_price=p.compare_price,
            is_featured=p.is_featured,
            tags=p.tags,
            thumbnail_url=primary,
            secondary_image=secondary,
            category=p.category,
            available_sizes=sizes,
        )

    @classmethod
    def list_admin_products(cls, db: Session, page: int, per_page: int, search: Optional[str] = None):
        products, total = ProductRepository.get_admin_products(db, page, per_page, search)
        items = [cls._build_admin_list_item(p) for p in products]
        return items, total

    @staticmethod
    def get_admin_product(db: Session, product_id: str):
        product = ProductRepository.get_admin_product_by_id(db, product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product

    @staticmethod
    def create_product(db: Session, data: ProductCreate):
        product = Product(
            name=data.name, slug=data.slug, description=data.description,
            price=data.price, compare_price=data.compare_price,
            category_id=data.category_id, is_active=data.is_active,
            is_featured=data.is_featured, tags=data.tags,
            thumbnail_url=data.thumbnail_url,
        )
        for v_data in data.variants:
            v_dict = v_data.model_dump()
            v_imgs = v_dict.pop('images', [])
            v_model = ProductVariant(**v_dict)
            for i in v_imgs:
                v_model.images.append(VariantImage(**i))
            product.variants.append(v_model)
            
        try:
            return ProductRepository.create_product(db, product)
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=400, detail=str(e))

    @classmethod
    def update_product(cls, db: Session, product_id: str, data: ProductUpdate):
        product = ProductRepository.get_admin_product_by_id(db, product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
            

        update_data = data.model_dump(exclude_none=True)
        variants_data = update_data.pop('variants', None)


        if variants_data is not None:
            new_variant_ids = {str(v['id']) for v in variants_data if v.get('id')}
            existing_variant_ids = {str(v.id) for v in product.variants}
            deleted_variant_ids = list(existing_variant_ids - new_variant_ids)
            
            if deleted_variant_ids:
                blocked = ProductRepository.check_variants_in_orders(db, deleted_variant_ids, cls.ACTIVE_ORDER_STATUSES)
                if blocked:
                    raise HTTPException(
                        status_code=409, 
                        detail=f"Cannot delete variants {blocked} because they are in active orders."
                    )

        try:
            return ProductRepository.update_product(db, product, update_data, variants_data)
        except Exception as e:
            db.rollback()
            import traceback
            traceback.print_exc()
            raise HTTPException(status_code=400, detail=str(e))

    @classmethod
    def delete_product(cls, db: Session, product_id: str):
        product = ProductRepository.get_admin_product_by_id(db, product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
            
        variant_ids = [str(v.id) for v in product.variants]
        blocked_variants = ProductRepository.check_variants_in_orders(db, variant_ids, cls.ACTIVE_ORDER_STATUSES)
        
        if blocked_variants:
            raise HTTPException(
                status_code=409, 
                detail=f"Cannot delete product. Variants {blocked_variants} are referenced in active orders."
            )
            
        ProductRepository.delete_product(db, product)

    @classmethod
    def delete_variant(cls, db: Session, product_id: str, variant_id: str):
        product = ProductRepository.get_admin_product_by_id(db, product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
            
        variant = next((v for v in product.variants if str(v.id) == variant_id), None)
        if not variant:
            raise HTTPException(status_code=404, detail="Variant not found on this product")
            
        blocked_variants = ProductRepository.check_variants_in_orders(db, [str(variant.id)], cls.ACTIVE_ORDER_STATUSES)
        
        if blocked_variants:
            raise HTTPException(
                status_code=409, 
                detail=f"Cannot delete variant {variant.id}. It is referenced in an active order."
            )
            
        ProductRepository.delete_variant(db, variant)

    @classmethod
    def list_public_products(cls, db: Session, **kwargs):
        products, total = ProductRepository.get_public_products(db, **kwargs)
        items = [cls._build_public_list_item(p) for p in products]
        return items, total

    @staticmethod
    def get_public_product(db: Session, slug: str):
        product = ProductRepository.get_public_product_by_slug(db, slug)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product

    @classmethod
    def get_featured_products(cls, db: Session, limit: int):
        products = ProductRepository.get_featured_products(db, limit)
        return [cls._build_public_list_item(p) for p in products]

    @staticmethod
    def get_categories(db: Session):
        return ProductRepository.get_categories(db)
