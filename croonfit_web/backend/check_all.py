from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv(".env")
engine = create_engine(os.environ["DATABASE_URL"])
with engine.connect() as conn:
    products = conn.execute(text("SELECT id, name FROM products WHERE name ILIKE '%oversized%'")).fetchall()
    for p in products:
        print(f"Product {p.id} - {p.name}")
        variants = conn.execute(text("SELECT id, size, color, image_url FROM product_variants WHERE product_id=:pid"), {"pid": p.id}).fetchall()
        for v in variants:
            print(f"  Variant {v.size} {v.color} - URL: {v.image_url}")
