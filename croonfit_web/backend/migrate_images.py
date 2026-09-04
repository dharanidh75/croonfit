import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Load environment variables
load_dotenv("backend/.env")
db_url = os.environ.get("DATABASE_URL")
if not db_url:
    print("DATABASE_URL not found")
    sys.exit(1)

engine = create_engine(db_url)

# SQL statements
sqls = [
    # 1. Add thumbnail_url to products
    "ALTER TABLE products ADD COLUMN IF NOT EXISTS thumbnail_url VARCHAR(500);",
    
    # 2. Migrate the first product_images URL to thumbnail_url for each product
    """
    UPDATE products p
    SET thumbnail_url = (
        SELECT url 
        FROM product_images pi 
        WHERE pi.product_id = p.id 
        ORDER BY sort_order ASC, is_primary DESC 
        LIMIT 1
    )
    WHERE thumbnail_url IS NULL;
    """,
    
    # 3. Drop existing product_images table if it exists (cascade to remove constraints)
    "DROP TABLE IF EXISTS product_images CASCADE;",
    
    # 4. Create new variant_images table
    """
    CREATE TABLE IF NOT EXISTS variant_images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
        url VARCHAR(500) NOT NULL,
        alt VARCHAR(255),
        is_primary BOOLEAN DEFAULT false,
        sort_order INTEGER DEFAULT 0
    );
    """,
    
    # 5. Create index for variant_id
    "CREATE INDEX IF NOT EXISTS ix_variant_images_variant_id ON variant_images(variant_id);",
    
    # 6. Migrate image_url from product_variants to variant_images
    """
    INSERT INTO variant_images (variant_id, url, is_primary, sort_order)
    SELECT id, image_url, true, 0
    FROM product_variants
    WHERE image_url IS NOT NULL AND image_url != '';
    """,
    
    # 7. Drop image_url from product_variants
    "ALTER TABLE product_variants DROP COLUMN IF EXISTS image_url;"
]

with engine.connect() as conn:
    with conn.begin():
        for sql in sqls:
            print(f"Executing: {sql[:50]}...")
            conn.execute(text(sql))
    
print("Migration completed successfully!")
