import os
import sys
from decimal import Decimal
from datetime import datetime, timezone

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), ".")))

from app.database import SessionLocal
from app.models.discount import Discount, DiscountType, DiscountRedemption

def run_tests():
    db = SessionLocal()
    try:
        # Create a test discount
        print("=== CREATE DISCOUNT ===")
        d = Discount(
            code="TEST20",
            type=DiscountType.PERCENTAGE,
            percentage_off=Decimal("20.00"),
            usage_cap=2,
            is_active=True
        )
        db.add(d)
        db.commit()
        db.refresh(d)
        print(f"Created discount {d.code} with ID {d.id}")

        print("Done. Clean up:")
        db.delete(d)
        db.commit()
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    run_tests()
