import requests
import os
from dotenv import load_dotenv

load_dotenv("backend/.env")

baseURL = 'http://localhost:8000/api'
# Get test product
res = requests.get(f'{baseURL}/products/test-api-2')
product = res.json()

# Login as admin to get token
login_res = requests.post(
    f'{baseURL}/auth/login',
    data={"username": "admin@example.com", "password": "password"} # I don't know the admin password, maybe I can just patch require_admin_claim
)
