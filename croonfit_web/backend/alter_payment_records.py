import os
from sqlalchemy import text
from app.database import engine

def add_razorpay_columns():
    queries = [
        "ALTER TABLE payment_records ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(100);",
        "ALTER TABLE payment_records ADD COLUMN IF NOT EXISTS razorpay_payment_id VARCHAR(100);",
        "ALTER TABLE payment_records ADD COLUMN IF NOT EXISTS razorpay_signature VARCHAR(255);"
    ]
    with engine.connect() as conn:
        for q in queries:
            print(f"Executing: {q}")
            conn.execute(text(q))
        conn.commit()
    print("Columns added successfully.")

if __name__ == "__main__":
    add_razorpay_columns()
