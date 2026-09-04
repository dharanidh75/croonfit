import asyncio
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

from app.models.product import ProductVariant
from app.services.product_service import ProductService
from app.schemas.product import ProductUpdate, ProductVariantUpdate

load_dotenv()
engine = create_engine(os.environ["DATABASE_URL"])
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

p_id = db.execute(text("SELECT id FROM products WHERE slug='test-api-2' LIMIT 1")).scalar()
v_id = db.execute(text("SELECT id FROM product_variants WHERE product_id=:pid LIMIT 1"), {"pid": p_id}).scalar()

data = ProductUpdate(
    variants=[ProductVariantUpdate(id=v_id, size="M", color="Black", sku="test-m-blk-2", stock_qty=10, image_url="/uploads/test.png")]
)
ProductService.update_product(db, str(p_id), data)
db.commit()

v_url = db.execute(text("SELECT image_url FROM product_variants WHERE id=:vid"), {"vid": v_id}).scalar()
print("Saved URL:", v_url)
