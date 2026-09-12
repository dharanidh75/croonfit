from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.main import app
from app.database import SessionLocal
from app.models.user import User
from app.models.shopping import Cart, CartItem
from app.models.product import Product, ProductVariant
from app.core.firebase_auth import get_current_user
import uuid

client = TestClient(app)

def run_tests():
    db = SessionLocal()
    
    # 1. Setup mock user and product
    test_user = db.query(User).filter(User.email == "test_merge@example.com").first()
    if not test_user:
        test_user = User(id=uuid.uuid4(), email="test_merge@example.com", firebase_uid="test_uid_merge")
        db.add(test_user)
        
    from app.models.product import Category
    category = db.query(Category).first()
    if not category:
        category = Category(id=uuid.uuid4(), name="Test Category", slug="test-category")
        db.add(category)
        db.commit()
        db.refresh(category)
        
    test_product = db.query(Product).filter(Product.slug == "test-product-merge").first()
    if not test_product:
        test_product = Product(id=uuid.uuid4(), name="Test Product Merge", slug="test-product-merge", price=100.0, is_active=True, category_id=category.id)
        db.add(test_product)
        
    db.commit()
    db.refresh(test_user)
    db.refresh(test_product)
    
    test_variant = db.query(ProductVariant).filter(ProductVariant.product_id == test_product.id).first()
    if not test_variant:
        test_variant = ProductVariant(id=uuid.uuid4(), product_id=test_product.id, size="M", color="Red", stock_qty=5, sku="TEST-SKU-1")
        db.add(test_variant)
        db.commit()
        db.refresh(test_variant)
    else:
        # Reset stock to 5 for test
        test_variant.stock_qty = 5
        db.commit()
        
    # Clear user's cart if any
    cart = db.query(Cart).filter(Cart.user_id == test_user.id).first()
    if cart:
        db.delete(cart)
        db.commit()

    # Override auth
    app.dependency_overrides[get_current_user] = lambda: test_user
    
    print("--- Testing Cart Merge (Clamping) ---")
    # Simulate guest cart with quantity 10 (exceeds stock 5)
    guest_cart = {
        "items": [
            {"variant_id": str(test_variant.id), "quantity": 10}
        ]
    }
    
    response = client.post("/api/cart/merge", json=guest_cart)
    print("Merge Status Code:", response.status_code)
    data = response.json()
    print("Merge Messages:", data.get("messages"))
    print("Merged Quantity:", data["merged_items"][0]["quantity"])
    
    # Assert clamping worked
    assert data["merged_items"][0]["quantity"] == 5
    assert len(data.get("messages")) > 0
    
    print("\n--- Testing Checkout Quantity Adjust (Stock Validation) ---")
    # Trying to increment past 5 should fail
    stock_check_payload = {
        "items": [
            {"variant_id": str(test_variant.id), "quantity": 6}
        ]
    }
    response = client.post("/api/orders/validate-stock", json=stock_check_payload)
    print("Validate Status Code:", response.status_code)
    data = response.json()
    print("Is Valid:", data.get("valid"))
    print("Issues:", data.get("issues"))
    
    assert data["valid"] == False
    assert len(data["issues"]) > 0
    
    print("\nAll tests passed successfully!")
    
if __name__ == "__main__":
    run_tests()
