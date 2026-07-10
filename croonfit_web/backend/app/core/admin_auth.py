"""
Separate admin authentication — different secret, different JWT audience.
No shared code path with the customer auth system.
"""
import jwt
from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.core.security import pwd_context

ALGORITHM = "HS256"
ADMIN_TOKEN_EXPIRE_MINUTES = 60 * 8   # 8 hour admin sessions
ADMIN_AUDIENCE = "croonfit-admin"

admin_oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/admin/login", auto_error=True)


def create_admin_token(admin_id: int, username: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ADMIN_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": str(admin_id),
        "username": username,
        "is_admin": True,
        "aud": ADMIN_AUDIENCE,
        "exp": expire,
    }
    return jwt.encode(payload, settings.ADMIN_SECRET_KEY, algorithm=ALGORITHM)


def decode_admin_token(token: str) -> dict:
    try:
        return jwt.decode(
            token,
            settings.ADMIN_SECRET_KEY,
            algorithms=[ALGORITHM],
            audience=ADMIN_AUDIENCE,
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Admin token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid admin token")


def require_admin(
    token: str = Depends(admin_oauth2_scheme),
    db: Session = Depends(get_db),
):
    from app.models.admin import AdminUser
    payload = decode_admin_token(token)
    if not payload.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")
    admin_id = payload.get("sub")
    admin = db.query(AdminUser).filter(AdminUser.id == int(admin_id)).first()
    if not admin or not admin.is_active:
        raise HTTPException(status_code=403, detail="Admin account not found or inactive")
    return admin


def get_admin_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_admin_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)
