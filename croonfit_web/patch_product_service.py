with open("backend/app/services/product_service.py", "r") as f:
    content = f.read()

import re
replacement = """
        update_data = data.model_dump(exclude_none=True)
        print("UPDATE DATA:", update_data)
        images_data = update_data.pop('images', None)
        variants_data = update_data.pop('variants', None)
        print("VARIANTS DATA:", variants_data)
"""
new_content = content.replace("""        update_data = data.model_dump(exclude_none=True)
        images_data = update_data.pop('images', None)
        variants_data = update_data.pop('variants', None)""", replacement)

with open("backend/app/services/product_service.py", "w") as f:
    f.write(new_content)
