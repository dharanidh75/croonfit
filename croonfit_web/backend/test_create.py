from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
from app.services.product_service import ProductService
from app.schemas.product import ProductCreate, ProductVariantCreate

load_dotenv()
engine = create_engine(os.environ["DATABASE_URL"])
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

# Get a valid category
cat_id = db.execute(text("SELECT id FROM categories LIMIT 1")).scalar()
if not cat_id:
    print("No categories!")
    exit(1)

data = ProductCreate(
    name="Test API",
    slug="test-api-2",
    description="Test",
    price=1500,
    compare_price=2000,
    category_id=cat_id,
    is_active=True,
    is_featured=False,
    tags=["test"],
    variants=[ProductVariantCreate(size="M", color="Black", sku="test-m-blk-2", stock_qty=10)],
    images=[]
)
try:
    ProductService.create_product(db, data)
    print("Success")
except Exception as e:
    import traceback
    traceback.print_exc()
