import requests
import os
from dotenv import load_dotenv

load_dotenv(".env")
baseURL = 'http://localhost:8000/api'
# We need to test the admin API. I'll just change require_admin_claim temporarily to test.
