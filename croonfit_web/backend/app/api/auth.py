from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserOut, Token, UserUpdate
from app.core.security import (
    get_password_hash, verify_password, create_access_token,
    get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
)
from datetime import timedelta

router = APIRouter()


@router.post("/register", response_model=UserOut, status_code=201)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user_in.email).first():
        raise HTTPException(status_code=400, detail="Email already registered.")
    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        role=user_in.role,
        company_name=user_in.company_name,
        phone=user_in.phone,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password.")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Account inactive.")

    token = create_access_token(
        data={"sub": str(user.id), "role": user.role},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return {"access_token": token, "token_type": "bearer", "user": user}


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


from app.models.user import User, UserAddress, UserPaymentMethod
from app.schemas.user import (
    UserCreate, UserLogin, UserOut, Token, UserUpdate,
    AddressCreate, AddressUpdate, AddressOut,
    PaymentMethodCreate, PaymentMethodOut
)
from typing import List

# ... existing code ...

@router.patch("/me", response_model=UserOut)
def update_me(
    data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    update_data = data.model_dump(exclude_unset=True)
    
    if "current_password" in update_data and "new_password" in update_data:
        if not verify_password(update_data["current_password"], current_user.hashed_password):
            raise HTTPException(status_code=400, detail="Incorrect current password")
        if update_data["new_password"]:
            current_user.hashed_password = get_password_hash(update_data["new_password"])
        del update_data["current_password"]
        del update_data["new_password"]
    
    for field, value in update_data.items():
        # Email uniqueness check
        if field == "email" and value != current_user.email:
            if db.query(User).filter(User.email == value).first():
                raise HTTPException(status_code=400, detail="Email already taken")
        setattr(current_user, field, value)
        
    db.commit()
    db.refresh(current_user)
    return current_user


# ─── Addresses ────────────────────────────────────────────────────────────

@router.get("/me/addresses", response_model=List[AddressOut])
def get_addresses(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(UserAddress).filter(UserAddress.user_id == current_user.id).order_by(UserAddress.id.desc()).all()


@router.post("/me/addresses", response_model=AddressOut)
def add_address(data: AddressCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if data.is_default:
        db.query(UserAddress).filter(UserAddress.user_id == current_user.id).update({"is_default": False})
    
    addr = UserAddress(**data.model_dump(), user_id=current_user.id)
    db.add(addr)
    db.commit()
    db.refresh(addr)
    return addr


@router.put("/me/addresses/{address_id}", response_model=AddressOut)
def update_address(address_id: int, data: AddressUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    addr = db.query(UserAddress).filter(UserAddress.id == address_id, UserAddress.user_id == current_user.id).first()
    if not addr:
        raise HTTPException(status_code=404, detail="Address not found")
        
    if data.is_default:
        db.query(UserAddress).filter(UserAddress.user_id == current_user.id).update({"is_default": False})

    for field, value in data.model_dump().items():
        setattr(addr, field, value)

    db.commit()
    db.refresh(addr)
    return addr


@router.delete("/me/addresses/{address_id}")
def delete_address(address_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    addr = db.query(UserAddress).filter(UserAddress.id == address_id, UserAddress.user_id == current_user.id).first()
    if not addr:
        raise HTTPException(status_code=404, detail="Address not found")
    db.delete(addr)
    db.commit()
    return {"message": "Address deleted"}


# ─── Payments ────────────────────────────────────────────────────────────

@router.get("/me/payments", response_model=List[PaymentMethodOut])
def get_payments(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(UserPaymentMethod).filter(UserPaymentMethod.user_id == current_user.id).order_by(UserPaymentMethod.id.desc()).all()


@router.post("/me/payments", response_model=PaymentMethodOut)
def add_payment(data: PaymentMethodCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    pm = UserPaymentMethod(**data.model_dump(), user_id=current_user.id)
    db.add(pm)
    db.commit()
    db.refresh(pm)
    return pm


@router.delete("/me/payments/{payment_id}")
def delete_payment(payment_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    pm = db.query(UserPaymentMethod).filter(UserPaymentMethod.id == payment_id, UserPaymentMethod.user_id == current_user.id).first()
    if not pm:
        raise HTTPException(status_code=404, detail="Payment method not found")
    db.delete(pm)
    db.commit()
    return {"message": "Payment method deleted"}
