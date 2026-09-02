import json
from fastapi.testclient import TestClient
from app.main import app
from app.core.firebase_auth import require_admin_claim
from app.database import SessionLocal

client = TestClient(app)

def mock_admin(): return {"uid": "test_uid", "admin": True}
app.dependency_overrides[require_admin_claim] = mock_admin

print("=== GET /api/admin/dealers ===")
res = client.get("/api/admin/dealers")
print(f"Status: {res.status_code}")
print(json.dumps(res.json(), indent=2))
