with open("backend/app/schemas/product.py", "r") as f:
    content = f.read()

import re

# Find VariantImageCreate block
create_block_match = re.search(r"class VariantImageCreate\(BaseModel\):.*?sort_order: int = 0", content, flags=re.DOTALL)
if create_block_match:
    create_block = create_block_match.group(0)
    # Remove it from where it is
    content = content.replace(create_block, "")
    
    # Find ProductVariantCreate
    content = content.replace("class ProductVariantCreate(BaseModel):", f"{create_block}\n\nclass ProductVariantCreate(BaseModel):")

# Find VariantImageUpdate block
update_block_match = re.search(r"class VariantImageUpdate\(BaseModel\):.*?sort_order: int = 0", content, flags=re.DOTALL)
if update_block_match:
    update_block = update_block_match.group(0)
    # Remove it from where it is
    content = content.replace(update_block, "")
    
    # Find ProductVariantUpdate
    content = content.replace("class ProductVariantUpdate(BaseModel):", f"{update_block}\n\nclass ProductVariantUpdate(BaseModel):")

with open("backend/app/schemas/product.py", "w") as f:
    f.write(content)
