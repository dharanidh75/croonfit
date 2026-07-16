from sqlalchemy import (
    Column, Integer, String, Float, Enum,
    DateTime, ForeignKey, JSON, func, Text
)
from sqlalchemy.orm import relationship
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

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(20), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)   # null = guest
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.UNPAID)
    subtotal = Column(Float, nullable=False)
    shipping_cost = Column(Float, default=0.0)
    total = Column(Float, nullable=False)
    shipping_address = Column(JSON, nullable=False)  # {name, line1, line2, city, state, pin, country}
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    status_history = relationship("OrderStatusHistory", back_populates="order", cascade="all, delete-orphan")
    payment = relationship("PaymentRecord", back_populates="order", uselist=False)


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    variant_id = Column(Integer, ForeignKey("product_variants.id"), nullable=False)
    product_name = Column(String(255), nullable=False)  # snapshot at time of order
    variant_label = Column(String(100), nullable=False) # e.g. "M / Black"
    product_image = Column(String(500), nullable=True)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")


class OrderStatusHistory(Base):
    """Audit trail for order status transitions."""
    __tablename__ = "order_status_history"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    status = Column(Enum(OrderStatus), nullable=False)
    note = Column(Text, nullable=True)
    changed_at = Column(DateTime(timezone=True), server_default=func.now())

    order = relationship("Order", back_populates="status_history")


class PaymentRecord(Base):
    """Dummy payment ledger — structured like a real Stripe ledger for easy swap later."""
    __tablename__ = "payment_records"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), unique=True, nullable=False)
    payment_id = Column(String(100), unique=True, nullable=False)  # fake "pi_xxx" id
    amount = Column(Float, nullable=False)
    currency = Column(String(3), default="INR")
    status = Column(Enum(PaymentStatus), default=PaymentStatus.UNPAID)
    card_last4 = Column(String(4), nullable=True)   # dummy: always "4242"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    confirmed_at = Column(DateTime(timezone=True), nullable=True)

    order = relationship("Order", back_populates="payment")
