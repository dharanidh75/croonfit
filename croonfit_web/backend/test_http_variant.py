import requests
import json
from dotenv import load_dotenv

baseURL = 'http://localhost:8000/api'

# 1. Get the product test-api-2
res = requests.get(f'{baseURL}/products/test-api-2')
product = res.json()
v = product['variants'][0]
print("Before:", v['image_url'])

# 2. Update it using the admin route
# Wait, we need an admin token. I'll just temporarily disable auth in upload.py or product_service?
