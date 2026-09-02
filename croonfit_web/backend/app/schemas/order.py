from uuid import UUID
from pydantic import BaseModel
from typing import Optional, List, Any, Dict
from datetime import datetime
from app.models.order import OrderStatus, PaymentStatus


# ─── Order Item ───────────────────────────────────────────────────────────────

class CartLineItem(BaseModel):
    """Input: what the frontend sends when creating an order."""
    variant_id: UUID
    quantity: int


class OrderItemOut(BaseModel):
    id: UUID
    variant_id: UUID
    product_name: str
    variant_label: str
    product_image: Optional[str] = None
    quantity: int
    unit_price: float

    class Config:
        from_attributes = True


# ─── Shipping Address ─────────────────────────────────────────────────────────

class ShippingAddress(BaseModel):
    full_name: str
    line1: str
    line2: Optional[str] = None
    city: str
    state: str
    pin: str
    country: str = "India"
    phone: str


# ─── Order ───────────────────────────────────────────────────────────────────

class OrderCreate(BaseModel):
    items: List[CartLineItem]
    shipping_address: ShippingAddress
    notes: Optional[str] = None


class OrderOut(BaseModel):
    id: UUID
    order_number: str
    status: OrderStatus
    payment_status: PaymentStatus
    subtotal: float
    shipping_cost: float
    total: float
    shipping_address: Dict[str, Any]
    created_at: Optional[datetime] = None
    items: List[OrderItemOut] = []

    class Config:
        from_attributes = True


class OrderStatusUpdate(BaseModel):
    status: OrderStatus
    note: Optional[str] = None


# ─── Stock Validation ─────────────────────────────────────────────────────────

class StockValidationRequest(BaseModel):
    items: List[CartLineItem]


class StockValidationIssue(BaseModel):
    variant_id: UUID
    requested: int
    available: int
    product_name: str
    variant_label: str


class StockValidationResponse(BaseModel):
    valid: bool
    issues: List[StockValidationIssue] = []


# ─── Payment ─────────────────────────────────────────────────────────────────

class PaymentIntentCreate(BaseModel):
    order_id: UUID


class PaymentIntentOut(BaseModel):
    payment_id: UUID
    amount: float
    currency: str
    order_id: UUID
    status: str


class PaymentConfirm(BaseModel):
    payment_id: UUID
    # Dummy card details — never stored beyond last4
    card_number: str   # always "4242 4242 4242 4242" in test mode
    card_expiry: str
    card_cvv: str


class PaymentConfirmOut(BaseModel):
    success: bool
    order_number: str
    payment_id: UUID
    message: str


# ─── Payment Ledger (admin) ───────────────────────────────────────────────────

class PaymentRecordOut(BaseModel):
    id: UUID
    order_id: UUID
    payment_id: UUID
    amount: float
    currency: str
    status: PaymentStatus
    card_last4: Optional[str] = None
    created_at: Optional[datetime] = None
    confirmed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
