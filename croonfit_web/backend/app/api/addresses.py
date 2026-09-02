from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.database import get_db
from app.models.user import User, UserAddress
from app.schemas.user import AddressCreate, AddressUpdate, AddressOut
from app.core.firebase_auth import verify_firebase_token
from app.services import address_service

router = APIRouter()

def get_current_user_id(db: Session = Depends(get_db), decoded_token: dict = Depends(verify_firebase_token)) -> UUID:
    firebase_uid = decoded_token.get("uid")
    if not firebase_uid:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return user.id


@router.get("/me/addresses", response_model=List[AddressOut])
def get_addresses(
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id)
):
    """Get all addresses for the authenticated user"""
    addresses = db.query(UserAddress).filter(UserAddress.user_id == user_id).order_by(UserAddress.created_at.desc()).all()
    return addresses


@router.post("/me/addresses", response_model=AddressOut, status_code=201)
def create_address(
    address_in: AddressCreate,
    force: bool = Query(False, description="Bypass duplicate detection"),
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id)
):
    """Create a new address for the authenticated user"""
    return address_service.create_address(db, user_id, address_in, force)


@router.put("/me/addresses/{address_id}", response_model=AddressOut)
def update_address(
    address_id: UUID,
    address_in: AddressUpdate,
    force: bool = Query(False, description="Bypass duplicate detection"),
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id)
):
    """Update an existing address"""
    return address_service.update_address(db, user_id, address_id, address_in, force)


@router.delete("/me/addresses/{address_id}", status_code=204)
def delete_address(
    address_id: UUID,
    db: Session = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id)
):
    """Delete an address"""
    address_service.delete_address(db, user_id, address_id)
    return None
