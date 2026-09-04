import requests
import json
res = requests.get('http://localhost:8000/api/products/test-api-2')
print(json.dumps(res.json().get('variants', []), indent=2))
