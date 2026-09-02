from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, Enum, text, Boolean, Numeric, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base
import enum

class DiscountType(str, enum.Enum):
    PERCENTAGE = "PERCENTAGE"
    FIXED_AMOUNT = "FIXED_AMOUNT"
    FREE_SHIPPING = "FREE_SHIPPING"

class Discount(Base):
    __tablename__ = "discounts"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    code = Column(String(50), unique=True, nullable=False)
    type = Column(Enum(DiscountType, name="discount_type"), nullable=False)
    percentage_off = Column(Numeric(5, 2))
    fixed_amount_off = Column(Numeric(10, 2))
    usage_cap = Column(Integer)
    current_usage = Column(Integer, nullable=False, server_default=text("0"))
    expires_at = Column(DateTime(timezone=True))
    is_active = Column(Boolean, nullable=False, server_default=text("true"))
    created_at = Column(DateTime(timezone=True), server_default=text("now()"), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=text("now()"), onupdate=text("now()"), nullable=False)

    redemptions = relationship("DiscountRedemption", back_populates="discount", cascade="all, delete-orphan")

    __table_args__ = (
        CheckConstraint(
            "(type = 'PERCENTAGE' AND percentage_off IS NOT NULL AND fixed_amount_off IS NULL) OR "
            "(type = 'FIXED_AMOUNT' AND fixed_amount_off IS NOT NULL AND percentage_off IS NULL) OR "
            "(type = 'FREE_SHIPPING' AND percentage_off IS NULL AND fixed_amount_off IS NULL)",
            name="chk_discount_type_consistency"
        ),
        CheckConstraint("percentage_off > 0 AND percentage_off <= 100", name="chk_percentage_bounds"),
        CheckConstraint("fixed_amount_off > 0", name="chk_fixed_amount_bounds"),
        CheckConstraint("usage_cap > 0", name="chk_usage_cap_bounds"),
    )

class DiscountRedemption(Base):
    __tablename__ = "discount_redemptions"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    discount_id = Column(UUID(as_uuid=True), ForeignKey("discounts.id", ondelete="RESTRICT"), index=True, nullable=False)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id", ondelete="CASCADE"), unique=True, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=True)
    discount_applied = Column(Numeric(10, 2), nullable=False)
    is_reversed = Column(Boolean, nullable=False, server_default=text("false"))
    created_at = Column(DateTime(timezone=True), server_default=text("now()"), nullable=False)

    discount = relationship("Discount", back_populates="redemptions")
    order = relationship("Order", back_populates="discount_redemption")
    user = relationship("User")
