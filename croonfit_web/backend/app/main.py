from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from app.config import settings
# pyrefly: ignore [missing-import]
from app.api import products, orders, payments, wishlist, admin
from app.api.admin import products as admin_products

app = FastAPI(
    title="Croonfit API",
    description="Backend for Croonfit clothing e-commerce platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Customer routes
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(orders.router,   prefix="/api/orders",   tags=["Orders"])
app.include_router(payments.router, prefix="/api/payments", tags=["Payments"])
app.include_router(wishlist.router, prefix="/api/wishlist", tags=["Wishlist"])

# Admin routes (separate auth, separate prefix)
app.include_router(admin.router,    prefix="/api/admin",    tags=["Admin"])
app.include_router(admin_products.router, prefix="/api/admin/products", tags=["Admin Products"])


@app.get("/", tags=["Health"])
def health():
    return {"status": "ok", "service": "Croonfit API"}
