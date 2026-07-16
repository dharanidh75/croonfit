import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models.product import Product, ProductVariant

db = SessionLocal()
try:
    product = Product(
        name="Test", slug="test-1234", description="Desc",
        price=100.0, category_id=1, is_active=True,
        tags=["new"]
    )
    product.variants.append(ProductVariant(
        size="M", color="Black", stock_qty=10, sku="TEST-SKU-1234"
    ))
    db.add(product)
    db.commit()
    print("SUCCESS")
except Exception as e:
    print(f"ERROR: {e}")
finally:
    db.close()
