from fastapi.testclient import TestClient
from app.main import app
from app.core.firebase_auth import require_admin_claim
import json

app.dependency_overrides[require_admin_claim] = lambda: {"uid": "test_admin", "admin": True}

client = TestClient(app)
res = client.get("/api/admin/products/089a82c5-74b6-4498-b0b0-de0e25ad21c8")
print(json.dumps(res.json().get('variants'), indent=2))
