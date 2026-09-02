import os
from fastapi import Request, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import auth, credentials
import json
from fastapi import Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from typing import Optional

# Initialize Firebase Admin SDK
firebase_creds_json = getattr(settings, "FIREBASE_CREDENTIALS_JSON", None) or os.environ.get("FIREBASE_CREDENTIALS_JSON")
firebase_creds_path = getattr(settings, "FIREBASE_CREDENTIALS_PATH", None) or os.environ.get("FIREBASE_CREDENTIALS_PATH")

if firebase_creds_json:
    try:
        cred_dict = json.loads(firebase_creds_json)
        cred = credentials.Certificate(cred_dict)
        firebase_admin.initialize_app(cred)
    except Exception as e:
        print(f"Failed to initialize Firebase Admin from JSON string: {e}")
elif firebase_creds_path:
    try:
        cred = credentials.Certificate(firebase_creds_path)
        firebase_admin.initialize_app(cred)
    except Exception as e:
        print(f"Failed to initialize Firebase Admin from path: {e}")
else:
    print("Warning: Neither FIREBASE_CREDENTIALS_JSON nor FIREBASE_CREDENTIALS_PATH set. Auth will fail.")


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

def require_admin_claim(
    decoded_token: dict = Security(verify_firebase_token),
    db: Session = Depends(get_db)
) -> dict:
    """Ensures the user has the 'ADMIN' role in the database."""
    from app.models.user import User, UserRole
    firebase_uid = decoded_token.get("uid")
    if not firebase_uid:
        raise HTTPException(status_code=401, detail="Invalid token payload")
        
    user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
    if not user or user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Not authorized. Admin privileges required in database.",
        )
    return decoded_token

def get_current_user(
    request: Request,
    decoded_token: dict = Security(verify_firebase_token),
    db: Session = Depends(get_db)
):
    from app.models.user import User
    firebase_uid = decoded_token.get("uid")
    if not firebase_uid:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found or inactive")
    request.state.user = user
    return user

def get_optional_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Security(HTTPBearer(auto_error=False)),
    db: Session = Depends(get_db)
):
    if not credentials:
        return None
    try:
        decoded_token = auth.verify_id_token(credentials.credentials)
        from app.models.user import User
        user = db.query(User).filter(User.firebase_uid == decoded_token.get("uid")).first()
        if user and user.is_active:
            request.state.user = user
            return user
    except Exception:
        pass
    return None
