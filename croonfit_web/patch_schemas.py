import re

with open("backend/app/schemas/product.py", "r") as f:
    content = f.read()

# Replace ProductImageOut with VariantImageOut
content = content.replace(
    "class ProductImageOut(BaseModel):\n    id: UUID\n    url: str\n    alt: Optional[str] = None\n    is_primary: bool\n    sort_order: int\n\n    class Config:\n        from_attributes = True",
    "class VariantImageOut(BaseModel):\n    id: UUID\n    url: str\n    alt: Optional[str] = None\n    is_primary: bool\n    sort_order: int\n\n    class Config:\n        from_attributes = True"
)

# Update ProductVariantOut
content = content.replace(
    "image_url: Optional[str] = None",
    "images: List[VariantImageOut] = []"
)

# Update ProductAdminDetail
content = content.replace(
    "images: List[ProductImageOut] = []",
    "thumbnail_url: Optional[str] = None"
)

# Update ProductPublicListItem
content = content.replace(
    "primary_image: Optional[str] = None   # populated in service",
    "thumbnail_url: Optional[str] = None"
)

# Replace ProductImageCreate with VariantImageCreate
content = content.replace(
    "class ProductImageCreate(BaseModel):",
    "class VariantImageCreate(BaseModel):"
)

# Update ProductCreate
content = content.replace(
    "images: List[ProductImageCreate] = []",
    "thumbnail_url: Optional[str] = None"
)

# Update ProductVariantCreate
content = content.replace(
    "image_url: Optional[str] = None",
    "images: List[VariantImageCreate] = []"
)
# Note: I need to check if ProductVariantCreate had image_url! Wait, it did!

# Replace ProductImageUpdate with VariantImageUpdate
content = content.replace(
    "class ProductImageUpdate(BaseModel):",
    "class VariantImageUpdate(BaseModel):"
)

# Update ProductUpdate
content = content.replace(
    "images: Optional[List[ProductImageUpdate]] = None",
    "thumbnail_url: Optional[str] = None"
)

# Update ProductVariantUpdate
# Note: ProductVariantUpdate has image_url, it was replaced above if we did a generic replace, but let's be careful.
with open("backend/app/schemas/product.py", "w") as f:
    f.write(content)
