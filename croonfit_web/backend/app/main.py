from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from app.config import settings
# pyrefly: ignore [missing-import]
from app.api import products, orders, payments, wishlist, admin, auth, addresses, discounts
from app.api.admin import products as admin_products
from fastapi.staticfiles import StaticFiles
import os
from contextlib import asynccontextmanager
import asyncio
from app.tasks import auto_cancel_pending_orders
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.core.limiter import limiter

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start the background task
    task = asyncio.create_task(auto_cancel_pending_orders())
    yield
    # Cleanup task on shutdown
    task.cancel()

app = FastAPI(
    title="Croonfit API",
    description="Backend for Croonfit clothing e-commerce platform",
    version="1.0.0",
    lifespan=lifespan,
)

# Add limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Use absolute path so uploads are found regardless of working directory
_BASE_DIR = os.path.dirname(os.path.abspath(__file__))
_UPLOADS_DIR = os.path.normpath(os.path.join(_BASE_DIR, "..", "uploads"))
os.makedirs(_UPLOADS_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=_UPLOADS_DIR), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "https://croonfit.vercel.app",
        # Add any other Vercel preview URLs below if needed
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth routes (user sync after Firebase login)
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(addresses.router, prefix="/api/auth", tags=["Addresses"])

# Customer routes
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(orders.router,   prefix="/api/orders",   tags=["Orders"])
app.include_router(payments.router, prefix="/api/payments", tags=["Payments"])
app.include_router(wishlist.router, prefix="/api/wishlist", tags=["Wishlist"])
app.include_router(discounts.router, prefix="/api/discounts", tags=["Discounts"])

# Admin routes (separate auth, separate prefix)
app.include_router(admin.router,    prefix="/api/admin",    tags=["Admin"])
app.include_router(admin_products.router, prefix="/api/admin/products", tags=["Admin Products"])


@app.get("/", tags=["Health"])
def health():
    return {"status": "ok", "service": "Croonfit API"}
