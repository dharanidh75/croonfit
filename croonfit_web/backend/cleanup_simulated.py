"""Clean up simulated test products and re-seed with curated products."""
import sys, os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models.product import Product

db = SessionLocal()
try:
    # Delete all simulated products (keep seed products)
    simulated = db.query(Product).filter(Product.name.like("Simulated%")).all()
    count = len(simulated)
    for p in simulated:
        db.delete(p)
    db.commit()
    print(f"✅ Cleaned up {count} simulated test products.")
    
    # Count remaining
    remaining = db.query(Product).count()
    print(f"📦 {remaining} curated products remain in DB.")
finally:
    db.close()
