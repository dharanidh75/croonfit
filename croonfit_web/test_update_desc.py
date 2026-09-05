import sys
import os
sys.path.append(os.getcwd())
from app.database import SessionLocal
from app.services.product_service import ProductService
from app.schemas.product import ProductUpdate

db = SessionLocal()
try:
    p = ProductService.get_public_product(db, "blue-shirt")
    print(f"Old desc: {repr(p.description)}")
    ProductService.update_product(db, str(p.id), ProductUpdate(description="This is a newly typed description!"))
    db.commit()
    p2 = ProductService.get_public_product(db, "blue-shirt")
    print(f"New desc: {repr(p2.description)}")
finally:
    db.close()
