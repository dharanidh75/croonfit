import re
from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import update
from app.models.user import UserAddress

def normalize_string(s: str) -> str:
    if not s:
        return ""
    # Lowercase and remove all non-alphanumeric characters (spaces, punctuation)
    return re.sub(r'[^a-z0-9]', '', s.lower())

def normalize_address(street: str, city: str, state: str, zip_code: str, country: str) -> str:
    return normalize_string(street) + normalize_string(city) + normalize_string(state) + normalize_string(zip_code) + normalize_string(country)

def handle_default_switch(user_id, is_default: bool, session: Session, exclude_address_id=None):
    if is_default:
        # Atomic update to unset is_default on all other addresses for this user
        stmt = update(UserAddress).where(UserAddress.user_id == user_id).values(is_default=False)
        if exclude_address_id:
            stmt = stmt.where(UserAddress.id != exclude_address_id)
        session.execute(stmt)

def check_duplicate(session: Session, user_id, address_data, force: bool, current_address_id=None):
    if force:
        return

    # Normalize incoming address
    norm_new = normalize_address(
        address_data.street,
        address_data.city,
        address_data.state,
        address_data.zip,
        address_data.country if hasattr(address_data, 'country') and address_data.country else 'India'
    )

    # Get user's existing addresses
    query = session.query(UserAddress).filter(UserAddress.user_id == user_id)
    if current_address_id:
        query = query.filter(UserAddress.id != current_address_id)
    
    existing_addresses = query.all()
    
    for addr in existing_addresses:
        norm_existing = normalize_address(addr.street, addr.city, addr.state, addr.zip, addr.country or 'India')
        if norm_new == norm_existing:
            raise HTTPException(
                status_code=409,
                detail={
                    "message": "This address already exists in your account.",
                    "existing_address": {
                        "id": str(addr.id),
                        "name": addr.name,
                        "street": addr.street,
                        "city": addr.city,
                        "state": addr.state,
                        "zip": addr.zip,
                        "country": addr.country
                    }
                }
            )

def create_address(session: Session, user_id, address_data, force: bool = False) -> UserAddress:
    check_duplicate(session, user_id, address_data, force)
    
    handle_default_switch(user_id, address_data.is_default, session)
    
    new_address = UserAddress(
        user_id=user_id,
        name=address_data.name,
        full_name=address_data.full_name,
        street=address_data.street,
        city=address_data.city,
        state=address_data.state,
        zip=address_data.zip,
        is_default=address_data.is_default
    )
    # Use default country logic defined in model if not provided, but schemas might not have it yet.
    if hasattr(address_data, 'country') and address_data.country:
        new_address.country = address_data.country

    session.add(new_address)
    session.commit()
    session.refresh(new_address)
    return new_address

def update_address(session: Session, user_id, address_id, address_data, force: bool = False) -> UserAddress:
    addr = session.query(UserAddress).filter(UserAddress.id == address_id).first()
    if not addr:
        raise HTTPException(status_code=404, detail="Address not found")
    if str(addr.user_id) != str(user_id):
        raise HTTPException(status_code=403, detail="Not authorized to modify this address")
        
    check_duplicate(session, user_id, address_data, force, current_address_id=address_id)
    
    handle_default_switch(user_id, address_data.is_default, session, exclude_address_id=address_id)
    
    addr.name = address_data.name
    addr.full_name = address_data.full_name
    addr.street = address_data.street
    addr.city = address_data.city
    addr.state = address_data.state
    addr.zip = address_data.zip
    addr.is_default = address_data.is_default
    
    if hasattr(address_data, 'country') and address_data.country:
        addr.country = address_data.country

    session.commit()
    session.refresh(addr)
    return addr

def delete_address(session: Session, user_id, address_id):
    addr = session.query(UserAddress).filter(UserAddress.id == address_id).first()
    if not addr:
        raise HTTPException(status_code=404, detail="Address not found")
    if str(addr.user_id) != str(user_id):
        raise HTTPException(status_code=403, detail="Not authorized to delete this address")
        
    session.delete(addr)
    session.commit()
