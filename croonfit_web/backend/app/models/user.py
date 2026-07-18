from sqlalchemy import (
    Column, Integer, String, Boolean, Enum,
    DateTime, func, ForeignKey
)
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class UserRole(str, enum.Enum):
    RETAILER = "RETAILER"
    WHOLESALER = "WHOLESALER"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    first_name = Column(String(100))
    last_name = Column(String(100))
    phone = Column(String(20), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    role = Column(Enum(UserRole), default=UserRole.RETAILER)
    is_active = Column(Boolean, default=True)
    company_name = Column(String(255), nullable=True)  # wholesalers
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    addresses = relationship("UserAddress", back_populates="user", cascade="all, delete-orphan")
    payment_methods = relationship("UserPaymentMethod", back_populates="user", cascade="all, delete-orphan")


class UserAddress(Base):
    __tablename__ = "user_addresses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100)) # e.g. Home, Office
    full_name = Column(String(100))
    street = Column(String(255))
    city = Column(String(100))
    state = Column(String(100))
    zip = Column(String(20))
    is_default = Column(Boolean, default=False)

    user = relationship("User", back_populates="addresses")


class UserPaymentMethod(Base):
    __tablename__ = "user_payment_methods"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    card_type = Column(String(50)) # e.g. Visa, Mastercard
    last4 = Column(String(4))
    expiry = Column(String(10))
    name_on_card = Column(String(100))

    user = relationship("User", back_populates="payment_methods")
