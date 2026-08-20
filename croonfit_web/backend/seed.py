"""
Seed script — populates the database with:
- 3 categories (Mens, Womens, Kids)
- Size charts per category
- 12 products with variants and images
- 1 default admin user (username: admin, password: admin123)

Run: cd backend && python seed.py
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine
from app.models import *  # noqa: F401, F403 — needed for Base.metadata
from app.database import Base
from app.core.security import get_password_hash
from app.core.admin_auth import get_admin_password_hash

Base.metadata.create_all(bind=engine)

db = SessionLocal()

def seed():
    # ── Admin ──────────────────────────────────────────────────────────────────
    if not db.query(AdminUser).filter(AdminUser.username == "admin").first():
        admin = AdminUser(
            username="admin",
            hashed_password=get_admin_password_hash("admin123"),
        )
        db.add(admin)
        db.flush()
        print("✓ Admin user created (admin / admin123)")
    else:
        print("Admin user already exists")  

    # ── Categories ────────────────────────────────────────────────────────────
    categories_data = [
        {"name": "Men's", "slug": "mens", "gender": GenderCategory.MENS,
         "description": "Premium activewear for men.",
         "cover_image_url": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200&auto=format&fit=crop"},
        {"name": "Women's", "slug": "womens", "gender": GenderCategory.WOMENS,
         "description": "Fashion-forward activewear for women.",
         "cover_image_url": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop"},
        {"name": "Kids'", "slug": "kids", "gender": GenderCategory.KIDS,
         "description": "Comfortable and stylish fits for kids.",
         "cover_image_url": "https://images.unsplash.com/photo-1622290291165-80a8daf8bfd2?q=80&w=1200&auto=format&fit=crop"},
    ]
    cats = {}
    for c in categories_data:
        existing = db.query(Category).filter(Category.slug == c["slug"]).first()
        if not existing:
            cat = Category(**c)
            db.add(cat)
            db.flush()
            cats[c["slug"]] = cat
        else:
            cats[c["slug"]] = existing
    db.commit()

    # ── Size Charts ───────────────────────────────────────────────────────────
    mens_chart_rows = [
        {"size": "XS", "chest_cm": 86, "length_cm": 68, "sleeve_cm": 58, "shoulder_cm": 40, "fit_note": "Slim fit"},
        {"size": "S",  "chest_cm": 92, "length_cm": 70, "sleeve_cm": 60, "shoulder_cm": 42, "fit_note": "Slim fit"},
        {"size": "M",  "chest_cm": 98, "length_cm": 72, "sleeve_cm": 62, "shoulder_cm": 44, "fit_note": "True to size"},
        {"size": "L",  "chest_cm": 104,"length_cm": 74, "sleeve_cm": 64, "shoulder_cm": 46, "fit_note": "True to size"},
        {"size": "XL", "chest_cm": 112,"length_cm": 76, "sleeve_cm": 66, "shoulder_cm": 48, "fit_note": "Relaxed fit"},
        {"size": "XXL","chest_cm": 120,"length_cm": 78, "sleeve_cm": 68, "shoulder_cm": 50, "fit_note": "Relaxed fit"},
    ]
    womens_chart_rows = [
        {"size": "XS", "chest_cm": 80, "length_cm": 60, "sleeve_cm": 54, "shoulder_cm": 36, "fit_note": "Slim fit"},
        {"size": "S",  "chest_cm": 86, "length_cm": 62, "sleeve_cm": 56, "shoulder_cm": 38, "fit_note": "True to size"},
        {"size": "M",  "chest_cm": 92, "length_cm": 64, "sleeve_cm": 58, "shoulder_cm": 40, "fit_note": "True to size"},
        {"size": "L",  "chest_cm": 98, "length_cm": 66, "sleeve_cm": 60, "shoulder_cm": 42, "fit_note": "Relaxed fit"},
        {"size": "XL", "chest_cm": 106,"length_cm": 68, "sleeve_cm": 62, "shoulder_cm": 44, "fit_note": "Relaxed fit"},
    ]
    kids_chart_rows = [
        {"size": "3-4Y", "chest_cm": 56, "length_cm": 40, "sleeve_cm": 30, "shoulder_cm": 26, "fit_note": "Standard"},
        {"size": "5-6Y", "chest_cm": 60, "length_cm": 44, "sleeve_cm": 33, "shoulder_cm": 28, "fit_note": "Standard"},
        {"size": "7-8Y", "chest_cm": 64, "length_cm": 48, "sleeve_cm": 36, "shoulder_cm": 30, "fit_note": "Standard"},
        {"size": "9-10Y","chest_cm": 68, "length_cm": 52, "sleeve_cm": 39, "shoulder_cm": 32, "fit_note": "Standard"},
        {"size": "11-12Y","chest_cm":72, "length_cm": 56, "sleeve_cm": 42, "shoulder_cm": 34, "fit_note": "Standard"},
    ]

    for slug, rows in [("mens", mens_chart_rows), ("womens", womens_chart_rows), ("kids", kids_chart_rows)]:
        cat = cats[slug]
        if not db.query(SizeChart).filter(SizeChart.category_id == cat.id).first():
            chart = SizeChart(category_id=cat.id, rows=rows)
            db.add(chart)
    db.commit()

    # ── Products ──────────────────────────────────────────────────────────────
    unsplash_fashion = [
        "photo-1521572163474-6864f9cf17ab",  # white tshirt
        "photo-1552374196-1ab2a1c593e8",  # dark hoodie
        "photo-1583743814966-8936f5b7be1a",  # joggers
        "photo-1620012254842-7f576d0a7a9a",  # jacket
        "photo-1617137968427-85924c800a22",  # cargo pants
        "photo-1542291026-7eec264c27ff",   # sneakers / flatlay
        "photo-1571945153237-4929e783af4a",  # womens top
        "photo-1548036328-c9fa89d128fa",   # womens jacket
        "photo-1594938298603-c8148c4b0a3f",  # kids tshirt
        "photo-1604671801908-6f0c6a092c05",  # mens polo
        "photo-1584273143981-41c073dfe8f8",  # hoodie 2
        "photo-1551854838-212c9a5c0a2c",   # track pants
    ]

    products_data = [
        # Men's
        {
            "name": "Grind Tech Tee", "slug": "grind-tech-tee", "category": "mens",
            "price": 1299, "compare_price": 1799, "is_featured": True,
            "tags": ["new", "bestseller"],
            "description": "Ultra-lightweight performance tee engineered for movement. 4-way stretch, moisture-wicking fabric keeps you cool during your most intense sessions.",
            "img_key": unsplash_fashion[0],
            "colors": [("Black", "#0A0A0A"), ("White", "#F5F5F5"), ("Charcoal", "#3A3A3A")],
        },
        {
            "name": "Blackout Hoodie", "slug": "blackout-hoodie", "category": "mens",
            "price": 2499, "compare_price": 3299, "is_featured": True,
            "tags": ["new"],
            "description": "The essential oversized hoodie. Heavy-knit French terry with a brushed interior lining. Drop-shoulder silhouette for the perfect oversized drape.",
            "img_key": unsplash_fashion[1],
            "colors": [("Black", "#0A0A0A"), ("Stone", "#9E9E9E")],
        },
        {
            "name": "Session Jogger", "slug": "session-jogger", "category": "mens",
            "price": 1899, "compare_price": None, "is_featured": True,
            "tags": ["bestseller"],
            "description": "Tapered joggers with a secure drawstring waist and deep side pockets. Made from 300gsm fleece for the ideal weight — not too heavy, not too thin.",
            "img_key": unsplash_fashion[2],
            "colors": [("Black", "#0A0A0A"), ("Graphite", "#555555")],
        },
        {
            "name": "Recon Jacket", "slug": "recon-jacket", "category": "mens",
            "price": 3499, "compare_price": 4299, "is_featured": False,
            "tags": ["new"],
            "description": "Windproof shell jacket with a clean minimalist design. Packable into its own chest pocket. Built for the transition from track to street.",
            "img_key": unsplash_fashion[3],
            "colors": [("Black", "#0A0A0A"), ("Olive", "#3D4A2E")],
        },
        {
            "name": "Utility Cargo Pant", "slug": "utility-cargo-pant", "category": "mens",
            "price": 2299, "compare_price": None, "is_featured": False,
            "tags": [],
            "description": "Six-pocket cargo pants with a tapered fit. Durable ripstop fabric, secure zip pockets for your essentials.",
            "img_key": unsplash_fashion[4],
            "colors": [("Black", "#0A0A0A"), ("Sand", "#C4A882")],
        },
        # Women's
        {
            "name": "Form Racerback", "slug": "form-racerback", "category": "womens",
            "price": 999, "compare_price": 1499, "is_featured": True,
            "tags": ["bestseller", "new"],
            "description": "Barely-there racerback tank with built-in shelf bra. Smooth matte fabric sculpts and moves with you from studio to street.",
            "img_key": unsplash_fashion[6],
            "colors": [("Black", "#0A0A0A"), ("White", "#F5F5F5"), ("Blush", "#E8B4B8")],
        },
        {
            "name": "Sculpt Legging", "slug": "sculpt-legging", "category": "womens",
            "price": 1799, "compare_price": 2299, "is_featured": True,
            "tags": ["bestseller"],
            "description": "High-waist compression leggings with tummy-control panel. Squat-proof, 4-way stretch fabric. Available in three sleek colorways.",
            "img_key": unsplash_fashion[5],
            "colors": [("Black", "#0A0A0A"), ("Charcoal", "#3A3A3A"), ("Stone", "#9E9E9E")],
        },
        {
            "name": "Oversize Studio Hoodie", "slug": "oversize-studio-hoodie", "category": "womens",
            "price": 2299, "compare_price": None, "is_featured": True,
            "tags": ["new"],
            "description": "Dropped-shoulder hoodie with a boxy, oversized cut. Designed to layer over your studio fits or wear as your off-duty essential.",
            "img_key": unsplash_fashion[7],
            "colors": [("Black", "#0A0A0A"), ("Cream", "#F5F0E8")],
        },
        {
            "name": "Minimal Bralette", "slug": "minimal-bralette", "category": "womens",
            "price": 799, "compare_price": 1099, "is_featured": False,
            "tags": [],
            "description": "Low-impact sports bralette with a wide underband for comfort. Seamless construction — invisible under any top.",
            "img_key": unsplash_fashion[10],
            "colors": [("Black", "#0A0A0A"), ("White", "#F5F5F5")],
        },
        # Kids'
        {
            "name": "Mini Grind Tee", "slug": "mini-grind-tee", "category": "kids",
            "price": 699, "compare_price": 999, "is_featured": True,
            "tags": ["new", "bestseller"],
            "description": "The Grind Tee, sized for the next generation. Same premium moisture-wicking performance fabric as the adult version.",
            "img_key": unsplash_fashion[8],
            "colors": [("Black", "#0A0A0A"), ("White", "#F5F5F5")],
        },
        {
            "name": "Junior Fleece Set", "slug": "junior-fleece-set", "category": "kids",
            "price": 1499, "compare_price": 1999, "is_featured": True,
            "tags": ["new"],
            "description": "Matching fleece hoodie + jogger set. Soft, pill-resistant fabric, elastic waist with drawstring.",
            "img_key": unsplash_fashion[9],
            "colors": [("Black", "#0A0A0A"), ("Grey", "#888888")],
        },
        {
            "name": "Pro Track Jacket (Kids)", "slug": "pro-track-jacket-kids", "category": "kids",
            "price": 1299, "compare_price": None, "is_featured": False,
            "tags": [],
            "description": "Full-zip track jacket with contrast piping. Lightweight, breathable, and water-resistant.",
            "img_key": unsplash_fashion[11],
            "colors": [("Black", "#0A0A0A")],
        },
    ]

    mens_sizes = ["XS", "S", "M", "L", "XL", "XXL"]
    womens_sizes = ["XS", "S", "M", "L", "XL"]
    kids_sizes = ["3-4Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y"]

    for p_data in products_data:
        existing = db.query(Product).filter(Product.slug == p_data["slug"]).first()
        if existing:
            continue

        cat = cats[p_data["category"]]
        sizes = mens_sizes if p_data["category"] == "mens" else (womens_sizes if p_data["category"] == "womens" else kids_sizes)

        product = Product(
            name=p_data["name"],
            slug=p_data["slug"],
            description=p_data["description"],
            price=p_data["price"],
            compare_price=p_data.get("compare_price"),
            category_id=cat.id,
            is_active=True,
            is_featured=p_data.get("is_featured", False),
            tags=p_data.get("tags", []),
        )

        # Images — primary + secondary from Unsplash
        base_url = f"https://images.unsplash.com/{p_data['img_key']}?q=80&w=800&auto=format&fit=crop"
        # Use a slightly different crop for secondary (hover)
        base_url2 = f"https://images.unsplash.com/{p_data['img_key']}?q=80&w=800&auto=format&fit=crop&crop=top"
        product.images = [
            ProductImage(url=base_url, alt=p_data["name"], is_primary=True, sort_order=0),
            ProductImage(url=base_url2, alt=f"{p_data['name']} detail", is_primary=False, sort_order=1),
        ]

        # Variants: one per size × color combo
        for i, size in enumerate(sizes):
            for j, (color, hex_code) in enumerate(p_data["colors"]):
                sku_suffix = f"{p_data['slug'][:8].upper()}-{size}-{color[:3].upper()}"
                product.variants.append(ProductVariant(
                    size=size,
                    color=color,
                    color_hex=hex_code,
                    stock_qty=10 + (i * 2),  # slightly more stock in mid-sizes
                    sku=sku_suffix,
                ))

        db.add(product)
        print(f"✓ Product: {product.name}")

    db.commit()
    print("\n✅ Seed complete!")
    db.close()


if __name__ == "__main__":
    seed()
