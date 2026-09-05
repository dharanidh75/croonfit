import sys
import os
sys.path.append(os.getcwd())
from app.database import SessionLocal
from app.models.product import Product

db = SessionLocal()
try:
    products = db.query(Product).all()
    print(f"Total products: {len(products)}")
    for p in products:
        print(f"Product '{p.name}' (slug: {p.slug}) desc: {repr(p.description)}")
finally:
    db.close()
