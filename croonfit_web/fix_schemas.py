import re

with open("backend/app/schemas/product.py", "r") as f:
    content = f.read()

# Fix ProductVariantCreate
content = re.sub(
    r"class ProductVariantCreate\(BaseModel\):.*?images: List\[VariantImageOut\] = \[\]",
    r"class ProductVariantCreate(BaseModel):\n    size: str\n    color: str\n    color_hex: Optional[str] = None\n    stock_qty: int = Field(0, ge=0)\n    sku: str\n    price: Optional[float] = None\n    images: List[VariantImageCreate] = []",
    content,
    flags=re.DOTALL
)

# Fix ProductVariantUpdate
content = re.sub(
    r"class ProductVariantUpdate\(BaseModel\):.*?images: List\[VariantImageOut\] = \[\]",
    r"class ProductVariantUpdate(BaseModel):\n    id: Optional[UUID] = None\n    size: str\n    color: str\n    color_hex: Optional[str] = None\n    stock_qty: int = Field(0, ge=0)\n    sku: str\n    price: Optional[float] = None\n    images: List[VariantImageUpdate] = []",
    content,
    flags=re.DOTALL
)

with open("backend/app/schemas/product.py", "w") as f:
    f.write(content)
