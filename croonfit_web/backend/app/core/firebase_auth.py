import os
from fastapi import Request, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import auth, credentials
import json
from app.config import settings

# Initialize Firebase Admin SDK
firebase_creds_path = getattr(settings, "FIREBASE_CREDENTIALS_PATH", None) or os.environ.get("FIREBASE_CREDENTIALS_PATH")
if firebase_creds_path:
    try:
        cred = credentials.Certificate(firebase_creds_path)
        firebase_admin.initialize_app(cred)
    except Exception as e:
        print(f"Failed to initialize Firebase Admin: {e}")
else:
    print("Warning: FIREBASE_CREDENTIALS_PATH not set. Auth will fail.")


security = HTTPBearer()

def verify_firebase_token(credentials: HTTPAuthorizationCredentials = Security(security)) -> dict:
    """Verifies a Firebase ID token and returns the decoded token payload."""
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def require_admin_claim(decoded_token: dict = Security(verify_firebase_token)) -> dict:
    """Ensures the decoded token has the 'admin' custom claim set to true."""
    if not decoded_token.get("admin") is True:
        raise HTTPException(
            status_code=403,
            detail="Not authorized. Admin privileges required.",
        )
    return decoded_token
