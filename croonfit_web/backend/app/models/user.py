from sqlalchemy import (
    Column, Integer, String, Boolean, Enum,
    DateTime, func
)
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
