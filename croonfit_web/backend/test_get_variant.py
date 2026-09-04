import asyncio
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

from app.models.product import ProductVariant
from app.services.product_service import ProductService
from app.schemas.product import ProductUpdate, ProductVariantUpdate

load_dotenv("backend/.env")
engine = create_engine(os.environ["DATABASE_URL"])
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

p_id = db.execute(text("SELECT id FROM products WHERE slug='test-api-2' LIMIT 1")).scalar()
product = ProductService.get_product_admin(db, str(p_id))
print("Variant image_urls:", [v.image_url for v in product.variants])
