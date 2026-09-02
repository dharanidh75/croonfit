from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, Enum, text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base
import enum

class POStatus(str, enum.Enum):
    PENDING = "PENDING"
    RECEIVED = "RECEIVED"
    CANCELLED = "CANCELLED"

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    po_number = Column(String(100), unique=True, nullable=False)
    supplier = Column(String(255))
    status = Column(Enum(POStatus, name="po_status"), nullable=False, default=POStatus.PENDING)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=text("now()"), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=text("now()"), onupdate=text("now()"), nullable=False)
    received_at = Column(DateTime(timezone=True))

    items = relationship("PurchaseOrderItem", back_populates="purchase_order", cascade="all, delete-orphan")


class PurchaseOrderItem(Base):
    __tablename__ = "purchase_order_items"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    po_id = Column(UUID(as_uuid=True), ForeignKey("purchase_orders.id", ondelete="CASCADE"), index=True, nullable=False)
    variant_id = Column(UUID(as_uuid=True), ForeignKey("product_variants.id", ondelete="SET NULL"), index=True, nullable=True)
    product_name = Column(String(255), nullable=False)
    variant_sku = Column(String(100), nullable=False)
    quantity_ordered = Column(Integer, nullable=False)
    quantity_received = Column(Integer, nullable=False, default=0)

    purchase_order = relationship("PurchaseOrder", back_populates="items")
    variant = relationship("ProductVariant")
