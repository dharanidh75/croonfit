import asyncio
from sqlalchemy import create_engine, text
import os

from dotenv import load_dotenv
load_dotenv()

engine = create_engine(os.environ["DATABASE_URL"])
with engine.connect() as conn:
    res = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'product_variants';"))
    print("product_variants columns:")
    for row in res:
        print(row[0])
