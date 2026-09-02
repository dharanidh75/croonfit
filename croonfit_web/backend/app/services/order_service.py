from sqlalchemy.orm import Session
from app.models.order import Order, OrderStatus, OrderStatusHistory
from app.models.product import ProductVariant
from app.models.discount import Discount

def cancel_order(db: Session, order: Order, note: str):
    """
    Shared logic for cancelling an order.
    1. Reverses discount usage
    2. Restores inventory stock
    3. Updates order status and history
    """
    if order.status == OrderStatus.CANCELLED:
        return
        
    # 1. Handle discount reversal
    redemption = order.discount_redemption
    if redemption and not redemption.is_reversed:
        discount = db.query(Discount).filter(Discount.id == redemption.discount_id).with_for_update().first()
        if discount and discount.current_usage > 0:
            discount.current_usage -= 1
        redemption.is_reversed = True

    # 2. Restore stock for each item
    for item in order.items:
        if item.variant_id:
            variant = db.query(ProductVariant).filter(ProductVariant.id == item.variant_id).with_for_update().first()
            if variant:
                variant.stock_qty += item.quantity

    # 3. Update status
    order.status = OrderStatus.CANCELLED
    order.status_history.append(OrderStatusHistory(status=OrderStatus.CANCELLED, note=note))
