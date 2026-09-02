import asyncio
import logging
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.order import Order, OrderStatus, OrderStatusHistory
from app.models.product import ProductVariant

logger = logging.getLogger(__name__)

async def auto_cancel_pending_orders():
    """
    Background task that runs continuously to cancel PENDING orders 
    that are older than 15 minutes, freeing up reserved stock.
    """
    while True:
        try:
            db: Session = SessionLocal()
            cutoff_time = datetime.now(timezone.utc) - timedelta(minutes=15)
            
            # Find all PENDING orders older than 15 minutes
            stale_orders = db.query(Order).filter(
                Order.status == OrderStatus.PENDING,
                Order.created_at <= cutoff_time
            ).all()

            for order in stale_orders:
                logger.info(f"Auto-canceling stale order {order.order_number}")
                
                # Use shared service to handle all cancellation logic consistently
                from app.services.order_service import cancel_order
                cancel_order(db, order, "Auto-cancelled due to payment timeout")
            
            if stale_orders:
                db.commit()
                
            db.close()
        except Exception as e:
            logger.error(f"Error in auto_cancel_pending_orders: {e}")
        
        # Sleep for a minute before checking again
        await asyncio.sleep(60)
