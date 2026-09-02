from dotenv import load_dotenv
load_dotenv(".env.development")

from sqlalchemy import text
from app.database import engine

with engine.connect() as conn:
    conn.execute(text("ALTER TABLE discount_redemptions ALTER COLUMN user_id DROP NOT NULL;"))
    conn.commit()
    print("discount_redemptions table altered")
