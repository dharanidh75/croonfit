from fastapi import APIRouter, Depends, HTTPException, Security, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import uuid

from app.database import get_db
from app.models.user import User
from app.core.firebase_auth import verify_firebase_token, get_current_user

router = APIRouter()


class SyncUserRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    avatar_url: Optional[str] = None


class SyncUserResponse(BaseModel):
    id: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    avatar_url: Optional[str] = None
    is_new: bool
    role: str

    class Config:
        from_attributes = True


@router.post("/sync", response_model=SyncUserResponse)
def sync_user(
    body: SyncUserRequest,
    db: Session = Depends(get_db),
    decoded_token: dict = Depends(verify_firebase_token),
):
    """
    Called by the frontend right after any Firebase sign-in (Google, email, etc).
    Creates the user row in Supabase if it doesn't exist, or updates it if it does.
    Returns user info + is_new flag.
    """
    firebase_uid = decoded_token.get("uid")
    email = decoded_token.get("email")

    if not firebase_uid or not email:
        raise HTTPException(status_code=400, detail="Invalid token: missing uid or email")

    # Try to find existing user
    user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
    is_new = False

    if not user:
        # Also check by email in case they had a pre-existing row
        user = db.query(User).filter(User.email == email).first()
        if user:
            # Link the existing row to their firebase UID
            user.firebase_uid = firebase_uid
        else:
            # Brand new user — create a row
            is_new = True
            # Parse name from Firebase token if not provided in body
            display_name = decoded_token.get("name", "")
            name_parts = display_name.split(" ", 1) if display_name else []
            first_name = body.first_name or (name_parts[0] if name_parts else None)
            last_name = body.last_name or (name_parts[1] if len(name_parts) > 1 else None)

            user = User(
                firebase_uid=firebase_uid,
                email=email,
                first_name=first_name,
                last_name=last_name,
                avatar_url=body.avatar_url or decoded_token.get("picture"),
            )
            db.add(user)

    # Update avatar/name if provided from the frontend
    if body.avatar_url:
        user.avatar_url = body.avatar_url
    if body.first_name:
        user.first_name = body.first_name
    if body.last_name:
        user.last_name = body.last_name

    db.commit()
    db.refresh(user)

    return SyncUserResponse(
        id=str(user.id),
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        avatar_url=user.avatar_url,
        is_new=is_new,
        role=user.role,
    )

class UpdateUserRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None


@router.patch("/me", response_model=SyncUserResponse)
def update_me(
    body: UpdateUserRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    from firebase_admin import auth as fb_auth
    
    # Update Supabase database fields
    if body.first_name is not None:
        current_user.first_name = body.first_name
    if body.last_name is not None:
        current_user.last_name = body.last_name
    if body.phone is not None:
        current_user.phone = body.phone
        
    # If they are changing their email, we must update Firebase too
    if body.email and body.email != current_user.email:
        try:
            fb_auth.update_user(current_user.firebase_uid, email=body.email)
            current_user.email = body.email
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to update email in Firebase: {e}")

    # If they want to change password, update via Firebase Admin
    if body.new_password:
        try:
            fb_auth.update_user(current_user.firebase_uid, password=body.new_password)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to update password: {e}")

    db.commit()
    db.refresh(current_user)
    
    return SyncUserResponse(
        id=str(current_user.id),
        email=current_user.email,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        avatar_url=current_user.avatar_url,
        is_new=False,
        role=current_user.role,
    )
