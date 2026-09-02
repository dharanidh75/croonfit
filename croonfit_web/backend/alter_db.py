from dotenv import load_dotenv
load_dotenv(".env.development")

from sqlalchemy import text
from app.database import engine

with engine.connect() as conn:
    conn.execute(text("ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;"))
    conn.commit()
    print("orders table altered")
