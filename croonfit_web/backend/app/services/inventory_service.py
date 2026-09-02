from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.product import Product, ProductVariant, Category
from app.models.order import OrderItem, Order, OrderStatus
from app.models.purchase_order import PurchaseOrderItem, PurchaseOrder, POStatus
from app.schemas.inventory import InventoryDashboardResponse, InventoryProductOut, InventoryVariantOut, InventorySummary, InventoryLowStockItem
from typing import List

class InventoryService:
    @staticmethod
    def get_inventory_dashboard(db: Session) -> InventoryDashboardResponse:
        # 1. Base Query for Products & Variants
        # We need products, their variants, and category names.
        
        # Aggregate subquery for Sold Quantity
        # Only count items from orders that are not CANCELLED or PENDING (wait, usually PLACED, SHIPPED, DELIVERED)
        # Assuming we just count all OrderItems (as requested, or we can filter by status)
        # Actually, let's filter out CANCELLED orders just to be safe.
        sold_subq = (
            db.query(
                OrderItem.variant_id,
                func.sum(OrderItem.quantity).label("sold_qty")
            )
            .join(Order, Order.id == OrderItem.order_id)
            .filter(Order.status != OrderStatus.CANCELLED)
            .group_by(OrderItem.variant_id)
            .subquery()
        )
        
        # Aggregate subquery for Incoming Quantity
        incoming_subq = (
            db.query(
                PurchaseOrderItem.variant_id,
                func.sum(PurchaseOrderItem.quantity_ordered - PurchaseOrderItem.quantity_received).label("incoming_qty")
            )
            .join(PurchaseOrder, PurchaseOrder.id == PurchaseOrderItem.po_id)
            .filter(PurchaseOrder.status == POStatus.PENDING)
            .group_by(PurchaseOrderItem.variant_id)
            .subquery()
        )
        
        # We query ProductVariant left joined with sold_subq and incoming_subq
        # Then join Product and Category
        query = (
            db.query(
                ProductVariant,
                Product,
                Category,
                func.coalesce(sold_subq.c.sold_qty, 0).label("sold"),
                func.coalesce(incoming_subq.c.incoming_qty, 0).label("incoming")
            )
            .join(Product, Product.id == ProductVariant.product_id)
            .join(Category, Category.id == Product.category_id)
            .outerjoin(sold_subq, sold_subq.c.variant_id == ProductVariant.id)
            .outerjoin(incoming_subq, incoming_subq.c.variant_id == ProductVariant.id)
        )
        
        results = query.all()
        
        # 2. Process into Hierarchy
        product_map = {}
        total_value = 0.0
        low_stock_count = 0
        total_incoming = 0
        
        for variant, product, category, sold, incoming in results:
            # Stats
            total_value += float(product.price) * variant.stock_qty
            if 0 < variant.stock_qty <= 5:
                low_stock_count += 1
            total_incoming += incoming
            
            # Group by product
            if product.id not in product_map:
                product_map[product.id] = {
                    "id": product.id,
                    "name": product.name,
                    "category": category.name,
                    "totalStock": 0,
                    "available": 0,
                    "sold": 0,
                    "status": "Out of Stock",
                    "variants": []
                }
            
            p_dict = product_map[product.id]
            
            var_status = "Out of Stock"
            if variant.stock_qty > 5:
                var_status = "In Stock"
            elif variant.stock_qty > 0:
                var_status = "Low Stock"
                
            p_dict["variants"].append(InventoryVariantOut(
                id=variant.id,
                name=f"{variant.size} / {variant.color}",
                sku=variant.sku,
                stock=variant.stock_qty,
                available=variant.stock_qty, # same as total_stock
                sold=sold,
                status=var_status
            ))
            
            p_dict["totalStock"] += variant.stock_qty
            p_dict["available"] += variant.stock_qty
            p_dict["sold"] += sold
        
        # Evaluate product-level status
        formatted_products = []
        for p_dict in product_map.values():
            if p_dict["totalStock"] > 5:
                p_dict["status"] = "In Stock"
            elif p_dict["totalStock"] > 0:
                p_dict["status"] = "Low Stock"
                
            formatted_products.append(InventoryProductOut(**p_dict))
            
        summary = InventorySummary(
            total_value=total_value,
            low_stock_variants=low_stock_count,
            incoming=total_incoming
        )
        
        return InventoryDashboardResponse(
            items=formatted_products,
            summary=summary
        )
