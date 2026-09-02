import json
from uuid import uuid4
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.main import app
from app.database import SessionLocal
from app.models.user import User
from app.models.product import Product, ProductVariant, Category, GenderCategory
from app.core.firebase_auth import verify_firebase_token
from decimal import Decimal

client = TestClient(app)
db = SessionLocal()

# Setup Data
test_uid1 = f"test_u1_{uuid4()}"
user1 = User(firebase_uid=test_uid1, email=f"{uuid4()}@example.com")
db.add(user1)

cat = Category(name="Test Category", slug=f"cat-{uuid4()}", gender=GenderCategory.MENS)
db.add(cat)
db.commit()

# Product 1: Decimal Test (Price 49.99, Active)
prod1 = Product(name="Decimal Product", slug=f"prod1-{uuid4()}", price=Decimal("49.99"), category_id=cat.id, is_active=True)
db.add(prod1)
db.commit()

var1 = ProductVariant(product_id=prod1.id, sku=f"SKU1-{uuid4()}", size="M", color="Red", stock_qty=10)
db.add(var1)
db.commit()
var1_id = str(var1.id)

# Product 2: Inactive Test
prod2 = Product(name="Inactive Product", slug=f"prod2-{uuid4()}", price=Decimal("10.00"), category_id=cat.id, is_active=False)
db.add(prod2)
db.commit()

var2 = ProductVariant(product_id=prod2.id, sku=f"SKU2-{uuid4()}", size="M", color="Blue", stock_qty=10)
db.add(var2)
db.commit()
var2_id = str(var2.id)

def mock_token_1(): return {"uid": test_uid1}
app.dependency_overrides[verify_firebase_token] = mock_token_1

# --- Test 1: Decimal Math ---
print(f"\n=== TEST 1: DECIMAL MATH ===")
# 49.99 * 3 = 149.97 (float math would often yield 149.97000000000003)
payload1 = {
    "items": [{"variant_id": var1_id, "quantity": 3}],
    "shipping_address": {
        "full_name": "Test User", "line1": "123 St", "city": "City", 
        "state": "ST", "pin": "12345", "phone": "555-5555"
    }
}
res1 = client.post("/api/orders", json=payload1)
print(f"Status: {res1.status_code}")
order1 = res1.json()
print(f"Subtotal Computed: {order1.get('subtotal')}")
print(f"Total Computed: {order1.get('total')}")


# --- Test 2: Inactive Product ---
print(f"\n=== TEST 2: INACTIVE PRODUCT ===")
payload2 = {
    "items": [{"variant_id": var2_id, "quantity": 1}],
    "shipping_address": {
        "full_name": "Test User", "line1": "123 St", "city": "City", 
        "state": "ST", "pin": "12345", "phone": "555-5555"
    }
}
res2 = client.post("/api/orders", json=payload2)
print(f"Status: {res2.status_code}")
print(f"Response: {res2.json()}")

db.close()
