from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException
from app.models.purchase_order import PurchaseOrder, PurchaseOrderItem, POStatus
from app.models.product import ProductVariant, Product
from app.repositories.purchase_order_repository import PurchaseOrderRepository
from app.schemas.purchase_order import PurchaseOrderCreate

class PurchaseOrderService:
    @staticmethod
    def create_po(db: Session, data: PurchaseOrderCreate) -> PurchaseOrder:
        # We need to fetch product name and variant sku for snapshotting
        variant_ids = [item.variant_id for item in data.items]
        variants = (
            db.query(ProductVariant)
            .options(joinedload(ProductVariant.product))
            .filter(ProductVariant.id.in_(variant_ids))
            .all()
        )
        
        variant_map = {v.id: v for v in variants}
        
        po_items = []
        for req_item in data.items:
            variant = variant_map.get(req_item.variant_id)
            if not variant:
                raise HTTPException(status_code=400, detail=f"Variant {req_item.variant_id} not found")
                
            po_items.append(PurchaseOrderItem(
                variant_id=variant.id,
                product_name=variant.product.name,
                variant_sku=variant.sku,
                quantity_ordered=req_item.quantity_ordered
            ))
            
        po = PurchaseOrder(
            po_number=data.po_number,
            supplier=data.supplier,
            notes=data.notes,
            items=po_items
        )
        
        PurchaseOrderRepository.create(db, po)
        db.commit()
        db.refresh(po)
        return po

    @staticmethod
    def receive_po(db: Session, po_id: str) -> PurchaseOrder:
        po = PurchaseOrderRepository.get_by_id(db, po_id)
        if not po:
            raise HTTPException(status_code=404, detail="Purchase order not found")
            
        if po.status == POStatus.RECEIVED:
            raise HTTPException(status_code=400, detail="Purchase order already received")
        if po.status == POStatus.CANCELLED:
            raise HTTPException(status_code=400, detail="Cannot receive cancelled purchase order")
            
        # Get variant IDs (skip null variant_ids from deleted variants)
        variant_ids = sorted(list(set(item.variant_id for item in po.items if item.variant_id)))
        
        if variant_ids:
            # Lock variants
            locked_variants = (
                db.query(ProductVariant)
                .filter(ProductVariant.id.in_(variant_ids))
                .with_for_update()
                .all()
            )
            variant_map = {v.id: v for v in locked_variants}
            
            for item in po.items:
                if item.variant_id:
                    variant = variant_map.get(item.variant_id)
                    if variant:
                        variant.stock_qty += item.quantity_ordered
                # Update item received quantity
                item.quantity_received = item.quantity_ordered
        
        # Mark PO as received
        PurchaseOrderRepository.mark_received(db, po)
        db.commit()
        db.refresh(po)
        return po
