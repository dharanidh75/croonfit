import json
from uuid import uuid4
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.main import app
from app.database import SessionLocal
from app.models.user import User
from app.models.product import Product, ProductVariant, Category, GenderCategory
from app.models.order import Order, OrderItem
from app.core.firebase_auth import require_admin_claim
from decimal import Decimal

client = TestClient(app)
db = SessionLocal()

# Setup Data
test_uid1 = f"test_admin_{uuid4()}"
user1 = User(firebase_uid=test_uid1, email=f"{uuid4()}@example.com")
db.add(user1)

cat = Category(name="Test Category", slug=f"cat-{uuid4()}", gender=GenderCategory.MENS)
db.add(cat)
db.commit()

# Product
prod = Product(name="PO Product", slug=f"prod-{uuid4()}", price=Decimal("100.00"), category_id=cat.id, is_active=True)
db.add(prod)
db.commit()

var = ProductVariant(product_id=prod.id, sku=f"SKU-{uuid4()}", size="L", color="Black", stock_qty=5)
db.add(var)
db.commit()
var_id = str(var.id)

# Create an OrderItem to verify 'sold' computation
order = Order(
    order_number=f"ORD-{str(uuid4())[:8]}",
    user_id=user1.id,
    subtotal=100.0,
    shipping_cost=0.0,
    total=100.0,
    shipping_address={}
)
db.add(order)
db.commit()

order_item = OrderItem(
    order_id=order.id,
    variant_id=var.id,
    product_name=prod.name,
    variant_label="L / Black",
    quantity=2,
    unit_price=100.0
)
db.add(order_item)
db.commit()

def mock_admin(): return {"uid": test_uid1, "admin": True}
app.dependency_overrides[require_admin_claim] = mock_admin

db.refresh(var)
print(f"=== INITIAL STATE ===")
print(f"Variant stock_qty: {var.stock_qty}")

# --- Test 1: Create PO ---
payload = {
    "po_number": f"PO-{uuid4()}",
    "supplier": "Acme Corp",
    "items": [{"variant_id": var_id, "quantity_ordered": 20}]
}
print(f"\n=== CREATE PO ===")
res1 = client.post("/api/admin/purchase-orders", json=payload)
print(f"Status: {res1.status_code}")
po = res1.json()
po_id = po["id"]
print(f"PO ID: {po_id}")

# --- Test 2: Check Inventory (Pending PO) ---
print(f"\n=== INVENTORY (PO PENDING) ===")
res2 = client.get("/api/admin/inventory")
inv = res2.json()
# Find our product
p_data = next(p for p in inv["items"] if p["id"] == str(prod.id))
v_data = p_data["variants"][0]
print(f"Product Sold: {p_data['sold']}")
print(f"Variant Stock: {v_data['stock']}")
print(f"Incoming in Summary: {inv['summary']['incoming']}")

# --- Test 3: Receive PO ---
print(f"\n=== RECEIVE PO ===")
res3 = client.post(f"/api/admin/purchase-orders/{po_id}/receive")
print(f"Status: {res3.status_code}")

db.expire_all()
var_after = db.query(ProductVariant).filter(ProductVariant.id == var_id).first()
print(f"Variant stock_qty AFTER receive: {var_after.stock_qty}")

# --- Test 4: Check Inventory (PO Received) ---
print(f"\n=== INVENTORY (PO RECEIVED) ===")
res4 = client.get("/api/admin/inventory")
inv4 = res4.json()
p_data4 = next(p for p in inv4["items"] if p["id"] == str(prod.id))
v_data4 = p_data4["variants"][0]
print(f"Product Sold: {p_data4['sold']}")
print(f"Variant Stock: {v_data4['stock']}")
print(f"Incoming in Summary: {inv4['summary']['incoming']}")

db.close()
