from sqlalchemy import (
    Column, Integer, String, Boolean, Enum, Float,
    Text, DateTime, ForeignKey, JSON, func
)
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class GenderCategory(str, enum.Enum):
    MENS = "MENS"
    WOMENS = "WOMENS"
    KIDS = "KIDS"
    UNISEX = "UNISEX"


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    gender = Column(Enum(GenderCategory), nullable=False)
    description = Column(Text, nullable=True)
    cover_image_url = Column(String(500), nullable=True)

    products = relationship("Product", back_populates="category")
    size_chart = relationship("SizeChart", back_populates="category", uselist=False)


class SizeChart(Base):
    """Measurement table per category. Rows is JSON: [{size, chest, length, sleeve, shoulder, fit_note}]"""
    __tablename__ = "size_charts"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), unique=True, nullable=False)
    # rows format: [{"size": "S", "chest_cm": 90, "length_cm": 70, "sleeve_cm": 60, "shoulder_cm": 42, "fit_note": "True to size"}]
    rows = Column(JSON, nullable=False)

    category = relationship("Category", back_populates="size_chart")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    compare_price = Column(Float, nullable=True)   # strike-through price
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    tags = Column(JSON, nullable=True)             # ["new", "bestseller"] etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    category = relationship("Category", back_populates="products")
    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan",
                          order_by="ProductImage.sort_order")


class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    size = Column(String(10), nullable=False)   # XS, S, M, L, XL, XXL
    color = Column(String(50), nullable=False)
    color_hex = Column(String(7), nullable=True) # e.g. "#1A1A1A"
    stock_qty = Column(Integer, default=0, nullable=False)
    sku = Column(String(100), unique=True, nullable=False)

    product = relationship("Product", back_populates="variants")


class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    url = Column(String(500), nullable=False)
    alt = Column(String(255), nullable=True)
    is_primary = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)

    product = relationship("Product", back_populates="images")
