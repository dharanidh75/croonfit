from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.firebase_auth import require_admin_claim
from app.services.inventory_service import InventoryService
from app.schemas.inventory import InventoryDashboardResponse

router = APIRouter()

@router.get("", response_model=InventoryDashboardResponse)
def get_inventory_dashboard(
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin_claim),
):
    return InventoryService.get_inventory_dashboard(db)
