from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.firebase_auth import require_admin_claim
from app.services.purchase_order_service import PurchaseOrderService
from app.repositories.purchase_order_repository import PurchaseOrderRepository
from app.schemas.purchase_order import (
    PurchaseOrderCreate, PurchaseOrderOut, PurchaseOrderListResponse
)
from app.models.purchase_order import POStatus
from typing import Optional

router = APIRouter()

@router.get("", response_model=PurchaseOrderListResponse)
def list_purchase_orders(
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin_claim),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status: Optional[POStatus] = Query(None),
):
    items, total = PurchaseOrderRepository.list_all(db, page, per_page, status)
    return PurchaseOrderListResponse(
        items=items,
        total=total,
        page=page,
        per_page=per_page,
        has_more=(page * per_page) < total,
    )

@router.get("/{po_id}", response_model=PurchaseOrderOut)
def get_purchase_order(
    po_id: str,
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin_claim),
):
    from fastapi import HTTPException
    po = PurchaseOrderRepository.get_by_id(db, po_id)
    if not po:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    return po

@router.post("", response_model=PurchaseOrderOut, status_code=201)
def create_purchase_order(
    data: PurchaseOrderCreate,
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin_claim),
):
    return PurchaseOrderService.create_po(db, data)

@router.post("/{po_id}/receive", response_model=PurchaseOrderOut)
def receive_purchase_order(
    po_id: str,
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin_claim),
):
    return PurchaseOrderService.receive_po(db, po_id)
