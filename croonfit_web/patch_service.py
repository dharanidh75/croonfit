import re

with open("backend/app/services/product_service.py", "r") as f:
    content = f.read()

# Fix imports
content = content.replace(
    "from app.models.product import Product, ProductVariant, ProductImage",
    "from app.models.product import Product, ProductVariant, VariantImage"
)

# Fix _build_admin_list_item
admin_list_item_old = """    def _build_admin_list_item(p: Product) -> ProductAdminListItem:
        primary_image = next((img.url for img in p.images if img.is_primary), None)
        if not primary_image and p.images:
            primary_image = p.images[0].url"""
admin_list_item_new = """    def _build_admin_list_item(p: Product) -> ProductAdminListItem:
        primary_image = p.thumbnail_url"""
content = content.replace(admin_list_item_old, admin_list_item_new)

# Fix _build_public_list_item
public_list_item_old = """    def _build_public_list_item(p: Product) -> ProductPublicListItem:
        primary = next((img.url for img in p.images if img.is_primary), None)
        if not primary and p.images:
            primary = p.images[0].url
        secondary = next((img.url for img in p.images if not img.is_primary), None)"""
public_list_item_new = """    def _build_public_list_item(p: Product) -> ProductPublicListItem:
        primary = p.thumbnail_url
        secondary = None"""
content = content.replace(public_list_item_old, public_list_item_new)

# Fix create_product
create_old = """        product = Product(
            name=data.name, slug=data.slug, description=data.description,
            price=data.price, compare_price=data.compare_price,
            category_id=data.category_id, is_active=data.is_active,
            is_featured=data.is_featured, tags=data.tags,
        )
        for v in data.variants:
            product.variants.append(ProductVariant(**v.model_dump()))
        for i in data.images:
            product.images.append(ProductImage(**i.model_dump()))"""
create_new = """        product = Product(
            name=data.name, slug=data.slug, description=data.description,
            price=data.price, compare_price=data.compare_price,
            category_id=data.category_id, is_active=data.is_active,
            is_featured=data.is_featured, tags=data.tags,
            thumbnail_url=data.thumbnail_url,
        )
        for v_data in data.variants:
            v_dict = v_data.model_dump()
            v_imgs = v_dict.pop('images', [])
            v_model = ProductVariant(**v_dict)
            for i in v_imgs:
                v_model.images.append(VariantImage(**i))
            product.variants.append(v_model)"""
content = content.replace(create_old, create_new)

# Fix update_product signature
update_old = """        update_data = data.model_dump(exclude_none=True)
        print("UPDATE DATA:", update_data)
        images_data = update_data.pop('images', None)
        variants_data = update_data.pop('variants', None)
        print("VARIANTS DATA:", variants_data)"""
update_new = """        update_data = data.model_dump(exclude_none=True)
        variants_data = update_data.pop('variants', None)"""
content = content.replace(update_old, update_new)

# Fix ProductRepository.update_product call
call_old = """        try:
            return ProductRepository.update_product(db, product, update_data, images_data, variants_data)"""
call_new = """        try:
            return ProductRepository.update_product(db, product, update_data, variants_data)"""
content = content.replace(call_old, call_new)

with open("backend/app/services/product_service.py", "w") as f:
    f.write(content)
