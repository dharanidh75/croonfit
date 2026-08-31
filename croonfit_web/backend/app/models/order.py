from sqlalchemy import (
    Column, String, Enum, Numeric, Integer, Text,
    DateTime, ForeignKey, JSON, text
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base
import enum


class OrderStatus(str, enum.Enum):
    PENDING = "PENDING"
    PLACED = "PLACED"
    SHIPPED = "SHIPPED"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"


class PaymentStatus(str, enum.Enum):
    UNPAID = "UNPAID"
    PAID = "PAID"
    REFUNDED = "REFUNDED"


class Order(Base):
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    order_number = Column(String(20), unique=True, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), index=True, nullable=False)
    status = Column(Enum(OrderStatus, name="order_status"), index=True, server_default="PENDING")
    payment_status = Column(Enum(PaymentStatus, name="payment_status"), server_default="UNPAID")
    subtotal = Column(Numeric(10, 2), nullable=False)
    shipping_cost = Column(Numeric(10, 2), server_default=text("0.0"))
    total = Column(Numeric(10, 2), nullable=False)
    shipping_address = Column(JSON, nullable=False)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=text("now()"))
    updated_at = Column(DateTime(timezone=True), server_default=text("now()"), onupdate=text("now()"))

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    status_history = relationship("OrderStatusHistory", back_populates="order", cascade="all, delete-orphan", order_by="OrderStatusHistory.changed_at.desc()")
    payment_record = relationship("PaymentRecord", back_populates="order", uselist=False, cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    # variant_id is SET NULL when product is deleted to preserve order history
    variant_id = Column(UUID(as_uuid=True), ForeignKey("product_variants.id", ondelete="SET NULL"), nullable=True)
    product_name = Column(String(255), nullable=False)
    variant_label = Column(String(100), nullable=False)
    product_image = Column(String(500))
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)

    order = relationship("Order", back_populates="items")
    variant = relationship("ProductVariant", back_populates="order_items")


class OrderStatusHistory(Base):
    __tablename__ = "order_status_history"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    status = Column(Enum(OrderStatus, name="order_status"), nullable=False)
    note = Column(Text)
    changed_at = Column(DateTime(timezone=True), server_default=text("now()"))

    order = relationship("Order", back_populates="status_history")


class PaymentRecord(Base):
    __tablename__ = "payment_records"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id", ondelete="CASCADE"), unique=True, nullable=False)
    payment_id = Column(String(100), unique=True, nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), server_default="INR")
    status = Column(Enum(PaymentStatus, name="payment_status"), server_default="UNPAID")
    card_last4 = Column(String(4))
    created_at = Column(DateTime(timezone=True), server_default=text("now()"))
    confirmed_at = Column(DateTime(timezone=True))

    order = relationship("Order", back_populates="payment_record")
