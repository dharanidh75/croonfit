from sqlalchemy import (
    Column, String, Boolean, Enum, Numeric, Integer,
    Text, DateTime, ForeignKey, JSON, text
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base
import enum


class GenderCategory(str, enum.Enum):
    MENS = "MENS"
    WOMENS = "WOMENS"
    KIDS = "KIDS"
    UNISEX = "UNISEX"


class Category(Base):
    __tablename__ = "categories"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    gender = Column(Enum(GenderCategory, name="gender_category"), nullable=False)
    description = Column(Text)
    cover_image_url = Column(String(500))

    size_chart = relationship("SizeChart", back_populates="category", uselist=False, cascade="all, delete-orphan")
    products = relationship("Product", back_populates="category")


class SizeChart(Base):
    __tablename__ = "size_charts"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    category_id = Column(UUID(as_uuid=True), ForeignKey("categories.id", ondelete="CASCADE"), unique=True, nullable=False)
    rows = Column(JSON, nullable=False)

    category = relationship("Category", back_populates="size_chart")


class Product(Base):
    __tablename__ = "products"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    description = Column(Text)
    price = Column(Numeric(10, 2), nullable=False)
    compare_price = Column(Numeric(10, 2))
    category_id = Column(UUID(as_uuid=True), ForeignKey("categories.id", ondelete="RESTRICT"), index=True, nullable=False)
    is_active = Column(Boolean, server_default=text("true"))
    is_featured = Column(Boolean, server_default=text("false"))
    tags = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=text("now()"))
    updated_at = Column(DateTime(timezone=True), server_default=text("now()"), onupdate=text("now()"))

    category = relationship("Category", back_populates="products")
    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan", order_by="ProductImage.sort_order")
    wishlisted_by = relationship("Wishlist", back_populates="product", cascade="all, delete-orphan")


class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), index=True, nullable=False)
    size = Column(String(10), nullable=False)
    color = Column(String(50), nullable=False)
    color_hex = Column(String(7))
    stock_qty = Column(Integer, server_default=text("0"), nullable=False)
    sku = Column(String(100), unique=True, nullable=False)

    product = relationship("Product", back_populates="variants")
    cart_items = relationship("CartItem", back_populates="variant", cascade="all, delete-orphan")
    order_items = relationship("OrderItem", back_populates="variant")


class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), index=True, nullable=False)
    url = Column(String(500), nullable=False)
    alt = Column(String(255))
    is_primary = Column(Boolean, server_default=text("false"))
    sort_order = Column(Integer, server_default=text("0"))

    product = relationship("Product", back_populates="images")
