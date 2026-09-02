import json
from uuid import uuid4
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.main import app
from app.database import SessionLocal
from app.models.user import User
from app.models.product import Product, ProductVariant, Category
from app.core.firebase_auth import verify_firebase_token

client = TestClient(app)

# Setup Test Data
db = SessionLocal()
test_uid1 = f"test_u1_{uuid4()}"
test_uid2 = f"test_u2_{uuid4()}"

user1 = User(firebase_uid=test_uid1, email=f"{uuid4()}@example.com")
user2 = User(firebase_uid=test_uid2, email=f"{uuid4()}@example.com")
db.add_all([user1, user2])

# Need a category
from app.models.product import GenderCategory
cat = Category(name="Test Category", slug=f"cat-{uuid4()}", gender=GenderCategory.MENS)
db.add(cat)
db.commit()

# Product & Variant
prod = Product(name="Test Product", slug=f"prod-{uuid4()}", price=50.0, category_id=cat.id)
db.add(prod)
db.commit()

var = ProductVariant(product_id=prod.id, sku=f"SKU-{uuid4()}", size="M", color="Red", stock_qty=10)
db.add(var)
db.commit()

db.refresh(user1)
db.refresh(user2)
db.refresh(var)
var_id = str(var.id)

print(f"=== INITIAL STOCK ===")
print(f"Variant {var_id} stock_qty = {var.stock_qty}")

# Auth mock
def mock_token_1(): return {"uid": test_uid1}
def mock_token_2(): return {"uid": test_uid2}

# --- Test 1: Order Creation and Stock Deduction ---
app.dependency_overrides[verify_firebase_token] = mock_token_1
payload = {
    "items": [{"variant_id": var_id, "quantity": 3}],
    "shipping_address": {
        "full_name": "Test User", "line1": "123 St", "city": "City", 
        "state": "ST", "pin": "12345", "phone": "555-5555"
    }
}
res = client.post("/api/orders", json=payload)
print(f"\n=== CREATE ORDER ===")
print(f"Status: {res.status_code}")
order_data = res.json()
order_id = order_data["id"]

# Verify stock deducted
db.expire_all()
var_after = db.query(ProductVariant).get(var_id)
print(f"Variant stock_qty AFTER order = {var_after.stock_qty}")

# --- Test 2: IDOR (Authenticated non-owner) ---
print(f"\n=== IDOR: AUTHENTICATED NON-OWNER ===")
app.dependency_overrides[verify_firebase_token] = mock_token_2
res = client.get(f"/api/orders/{order_id}")
print(f"Status: {res.status_code}")
print(f"Response: {res.json()}")

# --- Test 3: IDOR (Unauthenticated) ---
print(f"\n=== IDOR: UNAUTHENTICATED ===")
app.dependency_overrides.clear() # Removes the mock, it will try to read a real token which we don't send
res = client.get(f"/api/orders/{order_id}")
print(f"Status: {res.status_code}")
print(f"Response: {res.json()}")


# Cleanup
db.delete(var)
db.delete(prod)
db.delete(cat)
db.delete(user1)
db.delete(user2)
# We also created an order and order items
from app.models.order import Order
db.query(Order).filter(Order.id == order_id).delete()
db.commit()
db.close()
