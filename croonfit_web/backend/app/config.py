from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    SECRET_KEY: str
    ADMIN_SECRET_KEY: str = "admin_supersecret_change_in_production"
    DATABASE_URL: str
    # Mail (optional — only used for order confirmations)
    MAIL_USERNAME: Optional[str] = None
    MAIL_PASSWORD: Optional[str] = None
    MAIL_FROM: Optional[str] = "no-reply@croonfit.com"
    MAIL_PORT: int = 587
    MAIL_SERVER: Optional[str] = "smtp.gmail.com"
    # Free shipping threshold (in paise if INR, or cents if USD)
    FREE_SHIPPING_THRESHOLD: float = 999.0
    APP_ENV: str = "development"
    FIREBASE_CREDENTIALS_PATH: Optional[str] = None
    FIREBASE_CREDENTIALS_JSON: Optional[str] = None
    RAZORPAY_KEY_ID: str = "rzp_test_YOUR_KEY"
    RAZORPAY_KEY_SECRET: str = "YOUR_SECRET"
    RAZORPAY_WEBHOOK_SECRET: str = "YOUR_WEBHOOK_SECRET"

    model_config = {
        "env_file": ".env",
        "extra": "ignore"
    }

settings = Settings()
