from dotenv import load_dotenv
load_dotenv(".env")

from sqlalchemy import text
from app.database import engine

with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE product_variants ADD COLUMN price NUMERIC(10,2);"))
        print("Added price column")
    except Exception as e:
        print("Error adding price column (might already exist):", e)
    
    try:
        conn.execute(text("ALTER TABLE product_variants ADD COLUMN image_url VARCHAR(500);"))
        print("Added image_url column")
    except Exception as e:
        print("Error adding image_url column (might already exist):", e)
    
    conn.commit()
