import sys
import os
sys.path.append(os.getcwd() + '/backend')
from app.database import SessionLocal
from app.services.product_service import ProductService
from app.schemas.product import ProductUpdate

db = SessionLocal()
try:
    p = ProductService.get_public_product(db, "oversized")
    print("Old desc:", p.description)
    ProductService.update_product(db, str(p.id), ProductUpdate(description="Test description!"))
    db.commit()
    p2 = ProductService.get_public_product(db, "oversized")
    print("New desc:", p2.description)
finally:
    db.close()
