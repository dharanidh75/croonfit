from app.database import SessionLocal
from app.models.product import Product
db = SessionLocal()
p = db.query(Product).order_by(Product.created_at.desc()).first()
print(f"Product: {p.name}")
print(f"Images: {[img.url for img in p.images]}")
