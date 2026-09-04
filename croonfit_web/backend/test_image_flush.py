import asyncio
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

from app.models.product import ProductImage
from app.services.product_service import ProductService
from app.schemas.product import ProductUpdate, ProductImageUpdate

load_dotenv()
engine = create_engine(os.environ["DATABASE_URL"])
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

p_id = db.execute(text("SELECT id FROM products WHERE slug='test-api-2' LIMIT 1")).scalar()
if not p_id:
    print("No product!")
    exit(1)

# first add a primary image
db.execute(text("INSERT INTO product_images (product_id, url, is_primary) VALUES (:pid, 'http://test1', true) ON CONFLICT DO NOTHING"), {"pid": p_id})
db.commit()

# now try to update it using ProductUpdate
data = ProductUpdate(
    images=[ProductImageUpdate(url="http://test2", is_primary=True, sort_order=0)]
)

try:
    ProductService.update_product(db, str(p_id), data)
    print("Success")
except Exception as e:
    import traceback
    traceback.print_exc()
