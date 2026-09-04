import re

with open("backend/app/repositories/product_repository.py", "r") as f:
    content = f.read()

# Fix imports
content = content.replace(
    "from app.models.product import Product, ProductVariant, ProductImage",
    "from app.models.product import Product, ProductVariant, VariantImage"
)

# Fix get_admin_product_by_id
content = content.replace(
    "joinedload(Product.images),",
    ""
)

content = content.replace(
    "joinedload(Product.variants),",
    "joinedload(Product.variants).joinedload(ProductVariant.images),"
)

# Fix get_public_product_by_slug
content = content.replace(
    "joinedload(Product.images),",
    ""
)

# Fix get_admin_products images joinedload
content = content.replace(
    ".options(joinedload(Product.images), joinedload(Product.variants), joinedload(Product.category))",
    ".options(joinedload(Product.variants), joinedload(Product.category))"
)

# Fix update_product signature
update_old = """    def update_product(
        db: Session, 
        product: Product, 
        update_data: dict, 
        images_data: Optional[List[dict]] = None, 
        variants_data: Optional[List[dict]] = None
    ) -> Product:"""
update_new = """    def update_product(
        db: Session, 
        product: Product, 
        update_data: dict, 
        variants_data: Optional[List[dict]] = None
    ) -> Product:"""
content = content.replace(update_old, update_new)

# Remove images logic
images_logic = """        if images_data is not None:
            new_images = []
            for img_data in images_data:
                img_id = img_data.pop('id', None)
                if img_id:
                    existing = next((img for img in product.images if str(img.id) == str(img_id)), None)
                    if existing:
                        for k, v in img_data.items():
                            setattr(existing, k, v)
                        new_images.append(existing)
                    else:
                        new_images.append(ProductImage(**img_data))
                else:
                    new_images.append(ProductImage(**img_data))
            
            # Identify removed
            for img in product.images:
                if img not in new_images:
                    db.delete(img)
                    
            product.images = new_images"""
content = content.replace(images_logic, "")

# Update variants logic to handle variant images
variants_logic_old = """        if variants_data is not None:
            existing_variants = {str(v.id): v for v in product.variants}
            new_variants = []
            
            for v_data in variants_data:
                v_id = v_data.pop('id', None)
                if v_id and str(v_id) in existing_variants:
                    v = existing_variants[str(v_id)]
                    for k, v_val in v_data.items():
                        setattr(v, k, v_val)
                    new_variants.append(v)
                else:
                    new_v = ProductVariant(**v_data)
                    new_variants.append(new_v)
            
            for v_id, v in existing_variants.items():
                if v not in new_variants:
                    db.delete(v)
                    
            product.variants = new_variants"""
variants_logic_new = """        if variants_data is not None:
            existing_variants = {str(v.id): v for v in product.variants}
            new_variants = []
            
            for v_data in variants_data:
                v_imgs_data = v_data.pop('images', [])
                v_id = v_data.pop('id', None)
                
                if v_id and str(v_id) in existing_variants:
                    v = existing_variants[str(v_id)]
                    for k, v_val in v_data.items():
                        setattr(v, k, v_val)
                else:
                    v = ProductVariant(**v_data)
                
                # Handle variant images
                existing_imgs = {str(i.id): i for i in v.images}
                new_imgs = []
                for img_data in v_imgs_data:
                    img_id = img_data.pop('id', None)
                    if img_id and str(img_id) in existing_imgs:
                        img = existing_imgs[str(img_id)]
                        for k, i_val in img_data.items():
                            setattr(img, k, i_val)
                        new_imgs.append(img)
                    else:
                        new_imgs.append(VariantImage(**img_data))
                
                for img_id, img in existing_imgs.items():
                    if img not in new_imgs:
                        db.delete(img)
                v.images = new_imgs
                
                new_variants.append(v)
            
            for v_id, v in existing_variants.items():
                if v not in new_variants:
                    db.delete(v)
                    
            product.variants = new_variants"""
content = content.replace(variants_logic_old, variants_logic_new)

with open("backend/app/repositories/product_repository.py", "w") as f:
    f.write(content)
