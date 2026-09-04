from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv(".env")
engine = create_engine(os.environ["DATABASE_URL"])
with engine.connect() as conn:
    p_id = conn.execute(text("SELECT id FROM products WHERE name ILIKE '%oversized%' LIMIT 1")).scalar()
    if p_id:
        print(f"Found product: {p_id}")
        variants = conn.execute(text("SELECT id, size, color, image_url FROM product_variants WHERE product_id=:pid"), {"pid": p_id}).fetchall()
        for v in variants:
            print(f"Variant {v.size} {v.color} - URL: {v.image_url}")
    else:
        print("No oversized product found")
