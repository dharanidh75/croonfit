from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from typing import Optional, List
from app.models.product import Product, ProductVariant, ProductImage, Category, GenderCategory
from app.models.order import OrderItem, Order

class ProductRepository:
    
    @staticmethod
    def get_admin_products(db: Session, page: int, per_page: int, search: Optional[str] = None):
        q = db.query(Product).options(
            joinedload(Product.images),
            joinedload(Product.variants),
            joinedload(Product.category),
        )
        if search:
            q = q.filter(Product.name.ilike(f"%{search}%"))
        total = q.count()
        products = q.order_by(Product.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()
        return products, total

    @staticmethod
    def get_admin_product_by_id(db: Session, product_id: str) -> Optional[Product]:
        return db.query(Product).options(
            joinedload(Product.images),
            joinedload(Product.variants),
            joinedload(Product.category).joinedload(Category.size_chart),
        ).filter(Product.id == product_id).first()
        
    @staticmethod
    def get_public_products(
        db: Session,
        category: Optional[str] = None,
        gender: Optional[GenderCategory] = None,
        size: Optional[str] = None,
        color: Optional[str] = None,
        price_min: Optional[float] = None,
        price_max: Optional[float] = None,
        sort: Optional[str] = "newest",
        search: Optional[str] = None,
        page: int = 1,
        per_page: int = 12
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
        return products, total

    @staticmethod
    def get_public_product_by_slug(db: Session, slug: str) -> Optional[Product]:
        return (
            db.query(Product)
            .options(
                joinedload(Product.images),
                joinedload(Product.variants),
                joinedload(Product.category).joinedload(Category.size_chart),
            )
            .filter(Product.slug == slug, Product.is_active == True)
            .first()
        )

    @staticmethod
    def get_featured_products(db: Session, limit: int = 8):
        return (
            db.query(Product)
            .options(joinedload(Product.images), joinedload(Product.variants), joinedload(Product.category))
            .filter(Product.is_active == True, Product.is_featured == True)
            .order_by(Product.created_at.desc())
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_categories(db: Session):
        return db.query(Category).all()

    @staticmethod
    def create_product(db: Session, product: Product) -> Product:
        db.add(product)
        db.commit()
        db.refresh(product)
        return product

    @staticmethod
    def update_product(db: Session, product: Product, update_data: dict) -> Product:
        for key, value in update_data.items():
            setattr(product, key, value)
        db.commit()
        db.refresh(product)
        return product

    @staticmethod
    def delete_product(db: Session, product: Product):
        db.delete(product)
        db.commit()

    @staticmethod
    def get_variant_by_id(db: Session, variant_id: str) -> Optional[ProductVariant]:
        return db.query(ProductVariant).filter(ProductVariant.id == variant_id).first()

    @staticmethod
    def delete_variant(db: Session, variant: ProductVariant):
        db.delete(variant)
        db.commit()

    @staticmethod
    def check_variants_in_orders(db: Session, variant_ids: List[str], statuses: List[str]) -> List[str]:
        """
        Returns a list of variant_ids from the given list that are referenced by 
        an OrderItem belonging to an Order in any of the specified statuses.
        """
        if not variant_ids:
            return []
            
        referenced_variants = (
            db.query(OrderItem.variant_id)
            .join(Order, OrderItem.order_id == Order.id)
            .filter(
                OrderItem.variant_id.in_(variant_ids),
                Order.status.in_(statuses)
            )
            .distinct()
            .all()
        )
        return [str(v[0]) for v in referenced_variants]
