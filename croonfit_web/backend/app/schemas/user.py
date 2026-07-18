from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.user import UserRole


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    role: UserRole = UserRole.RETAILER
    company_name: Optional[str] = None
    phone: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr
    first_name: str
    last_name: str
    role: UserRole
    company_name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    company_name: Optional[str] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None


class AddressBase(BaseModel):
    name: str
    full_name: str
    street: str
    city: str
    state: str
    zip: str
    is_default: bool = False


class AddressCreate(AddressBase):
    pass


class AddressUpdate(AddressBase):
    pass


class AddressOut(AddressBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True


class PaymentMethodBase(BaseModel):
    name_on_card: str
    card_type: str
    last4: str
    expiry: str


class PaymentMethodCreate(PaymentMethodBase):
    pass


class PaymentMethodOut(PaymentMethodBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


class AdminLogin(BaseModel):
    username: str
    password: str


class AdminToken(BaseModel):
    access_token: str
    token_type: str
