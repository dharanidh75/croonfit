from sqlalchemy.orm import Session, joinedload
from app.models.purchase_order import PurchaseOrder, POStatus
from typing import Tuple, List, Optional
from datetime import datetime, timezone

class PurchaseOrderRepository:
    @staticmethod
    def create(db: Session, po: PurchaseOrder) -> PurchaseOrder:
        db.add(po)
        db.flush()
        return po

    @staticmethod
    def get_by_id(db: Session, po_id: str) -> Optional[PurchaseOrder]:
        return (
            db.query(PurchaseOrder)
            .options(joinedload(PurchaseOrder.items))
            .filter(PurchaseOrder.id == po_id)
            .first()
        )

    @staticmethod
    def list_all(db: Session, page: int, per_page: int, status: Optional[POStatus] = None) -> Tuple[List[PurchaseOrder], int]:
        q = db.query(PurchaseOrder).options(joinedload(PurchaseOrder.items))
        if status:
            q = q.filter(PurchaseOrder.status == status)
            
        total = q.count()
        items = q.order_by(PurchaseOrder.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()
        return items, total

    @staticmethod
    def mark_received(db: Session, po: PurchaseOrder) -> PurchaseOrder:
        po.status = POStatus.RECEIVED
        po.received_at = datetime.now(timezone.utc)
        # Assuming the caller has acquired variant locks and incremented stock/quantities.
        db.flush()
        return po
