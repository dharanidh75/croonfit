from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
import os
import shutil
from uuid import uuid4
from app.core.firebase_auth import require_admin_claim

router = APIRouter()

# Always store relative to this file's location so it works regardless of cwd
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "..", "..", "..", "uploads")
UPLOAD_DIR = os.path.normpath(UPLOAD_DIR)
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/avif"}
ALLOWED_EXTS = {"jpg", "jpeg", "png", "webp", "gif", "avif"}

@router.post("")
def upload_file(
    file: UploadFile = File(...),
    admin: dict = Depends(require_admin_claim)
):
    try:
        ext = file.filename.rsplit('.', 1)[-1].lower() if '.' in file.filename else 'jpg'
        if ext not in ALLOWED_EXTS:
            raise HTTPException(status_code=400, detail=f"File type '.{ext}' not allowed. Use jpg, png, or webp.")
        filename = f"{uuid4().hex}.{ext}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return {"url": f"/uploads/{filename}"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")
