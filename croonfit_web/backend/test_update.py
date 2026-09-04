from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
from app.services.product_service import ProductService
from app.schemas.product import ProductUpdate, ProductVariantUpdate

load_dotenv()
engine = create_engine(os.environ["DATABASE_URL"])
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

# Get the product I just created
p_id = db.execute(text("SELECT id FROM products WHERE slug='test-api-2' LIMIT 1")).scalar()
if not p_id:
    print("No product!")
    exit(1)
v_id = db.execute(text("SELECT id FROM product_variants WHERE product_id=:pid LIMIT 1"), {"pid": p_id}).scalar()
if not v_id:
    print("No variant!")
    exit(1)

data = ProductUpdate(
    name="Test API Update",
    slug="test-api-2",
    price=1500,
    is_active=True,
    is_featured=False,
    tags=["test"],
    variants=[ProductVariantUpdate(id=v_id, size="M", color="Black", sku="test-m-blk-2", stock_qty=10)],
    images=[]
)
try:
    ProductService.update_product(db, str(p_id), data)
    print("Success")
except Exception as e:
    import traceback
    traceback.print_exc()
