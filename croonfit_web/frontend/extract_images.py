import fitz # PyMuPDF
import io
import os
from PIL import Image

pdf_path = r"C:\Users\Kamaleswaran\OneDrive\Desktop\project\croonfit\croonfit\Croon.fit - Blank Apparel Catalogue Oct 25.pdf"
output_dir = r"C:\Users\Kamaleswaran\OneDrive\Desktop\project\croonfit\croonfit\croonfit_web\frontend\public\images\catalogue"

os.makedirs(output_dir, exist_ok=True)

pdf_document = fitz.open(pdf_path)

image_count = 0
for page_index in range(len(pdf_document)):
    page = pdf_document[page_index]
    image_list = page.get_images(full=True)
    
    for image_index, img in enumerate(image_list):
        xref = img[0]
        base_image = pdf_document.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        
        try:
            image = Image.open(io.BytesIO(image_bytes))
            # Filter out tiny logos/icons
            if image.width > 300 and image.height > 300:
                image_count += 1
                image_path = os.path.join(output_dir, f"cat_{page_index}_{image_count}.{image_ext}")
                image.save(image_path)
                print(f"Saved {image_path}")
        except Exception as e:
            print(f"Failed on page {page_index}: {e}")

print(f"Total images extracted: {image_count}")
