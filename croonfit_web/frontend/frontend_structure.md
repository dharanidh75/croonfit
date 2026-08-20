# Frontend File Structure

```text
frontend/
├── .gitignore
├── extract_images.py
├── frontend_structure.md
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── public
│   ├── images
│   │   └── catalogue
│   │       ├── cat_0_1.jpeg
│   │       ├── cat_0_2.png
│   │       ├── cat_10_12.png
│   │       ├── cat_11_13.png
│   │       ├── cat_11_14.png
│   │       ├── cat_11_15.png
│   │       ├── cat_12_16.png
│   │       ├── cat_13_17.png
│   │       ├── cat_13_18.png
│   │       ├── cat_13_19.png
│   │       ├── cat_14_20.png
│   │       ├── cat_15_21.png
│   │       ├── cat_15_22.png
│   │       ├── cat_15_23.png
│   │       ├── cat_16_24.png
│   │       ├── cat_17_25.png
│   │       ├── cat_17_26.jpeg
│   │       ├── cat_18_27.png
│   │       ├── cat_21_28.png
│   │       ├── cat_22_29.png
│   │       ├── cat_23_30.png
│   │       ├── cat_24_31.png
│   │       ├── cat_24_32.png
│   │       ├── cat_25_33.png
│   │       ├── cat_26_34.png
│   │       ├── cat_27_35.png
│   │       ├── cat_27_36.png
│   │       ├── cat_28_37.png
│   │       ├── cat_29_38.png
│   │       ├── cat_2_3.jpeg
│   │       ├── cat_2_4.png
│   │       ├── cat_30_39.png
│   │       ├── cat_30_40.png
│   │       ├── cat_32_41.jpeg
│   │       ├── cat_32_42.png
│   │       ├── cat_33_43.png
│   │       ├── cat_35_44.png
│   │       ├── cat_36_45.png
│   │       ├── cat_36_46.png
│   │       ├── cat_37_47.jpeg
│   │       ├── cat_37_48.png
│   │       ├── cat_38_49.png
│   │       ├── cat_39_50.png
│   │       ├── cat_39_51.png
│   │       ├── cat_39_52.png
│   │       ├── cat_3_5.jpeg
│   │       ├── cat_40_53.png
│   │       ├── cat_41_54.jpeg
│   │       ├── cat_42_55.jpeg
│   │       ├── cat_43_56.png
│   │       ├── cat_43_57.png
│   │       ├── cat_44_58.jpeg
│   │       ├── cat_45_59.png
│   │       ├── cat_46_60.png
│   │       ├── cat_47_61.png
│   │       ├── cat_47_62.png
│   │       ├── cat_47_63.png
│   │       ├── cat_48_64.png
│   │       ├── cat_49_65.png
│   │       ├── cat_49_66.png
│   │       ├── cat_4_6.png
│   │       ├── cat_50_67.png
│   │       ├── cat_51_68.png
│   │       ├── cat_51_69.jpeg
│   │       ├── cat_55_70.png
│   │       ├── cat_55_71.png
│   │       ├── cat_55_72.png
│   │       ├── cat_55_73.png
│   │       ├── cat_5_7.png
│   │       ├── cat_6_8.png
│   │       ├── cat_7_9.png
│   │       ├── cat_8_10.png
│   │       └── cat_9_11.png
│   ├── logo-word.png
│   └── logo.png
├── src
│   ├── App.jsx
│   ├── components
│   │   ├── AboutSection.jsx
│   │   ├── Footer.jsx
│   │   ├── Hub.jsx
│   │   ├── Logo.jsx
│   │   ├── Navbar.jsx
│   │   ├── account
│   │   │   ├── AddressSection.jsx
│   │   │   ├── OrdersSection.jsx
│   │   │   ├── PaymentSection.jsx
│   │   │   ├── SecuritySection.jsx
│   │   │   └── SupportSection.jsx
│   │   ├── admin
│   │   │   ├── AdminHeader.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── AdminProtectedRoute.jsx
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── DataTable.jsx
│   │   │   ├── StatusPill.jsx
│   │   │   └── ui
│   │   │       ├── Card.jsx
│   │   │       ├── DataTable.jsx
│   │   │       ├── KPICard.jsx
│   │   │       └── SimpleChart.jsx
│   │   ├── checkout
│   │   │   ├── CheckoutForm.jsx
│   │   │   ├── OrderSummary.jsx
│   │   │   └── PaymentForm.jsx
│   │   ├── layout
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── PageTransition.jsx
│   │   ├── product
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductGallery.jsx
│   │   │   ├── SizeGuideModal.jsx
│   │   │   └── SizeSelector.jsx
│   │   └── ui
│   │       ├── AmazonZoom.jsx
│   │       ├── ImageWithFallback.jsx
│   │       ├── SearchOverlay.jsx
│   │       ├── Skeleton.jsx
│   │       └── StockBadge.jsx
│   ├── images
│   │   ├── Polo.jpg
│   │   ├── cargo.jpg
│   │   ├── hoodies.jpg
│   │   ├── joggers.jpg
│   │   ├── kids.jpg
│   │   ├── mens.jpg
│   │   ├── oversizd.jpg
│   │   ├── quality.jpg
│   │   ├── retail.jpg
│   │   ├── round neck.jpg
│   │   ├── shirt.jpg
│   │   ├── wholesale.jpg
│   │   ├── wholesale2.jpg
│   │   └── women.jpg
│   ├── index.css
│   ├── lib
│   │   ├── api.js
│   │   └── mockData.js
│   ├── main.jsx
│   ├── pages
│   │   ├── About.jsx
│   │   ├── Account.jsx
│   │   ├── Cart.jsx
│   │   ├── Category.jsx
│   │   ├── Checkout.jsx
│   │   ├── Contact.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── NotFound.jsx
│   │   ├── OrderSuccess.jsx
│   │   ├── Orders.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── ProductListing.jsx
│   │   ├── Retail.jsx
│   │   ├── Wholesale.jsx
│   │   ├── Wishlist.jsx
│   │   └── admin
│   │       ├── AdminAnalytics.jsx
│   │       ├── AdminBilling.jsx
│   │       ├── AdminCMS.jsx
│   │       ├── AdminCustomers.jsx
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminDealers.jsx
│   │       ├── AdminDiscounts.jsx
│   │       ├── AdminInventory.jsx
│   │       ├── AdminLogin.jsx
│   │       ├── AdminOrders.jsx
│   │       ├── AdminProducts.jsx
│   │       └── products
│   │           ├── Categories.jsx
│   │           └── ProductForm.jsx
│   ├── store
│   │   └── index.js
│   ├── utils
│   │   └── colors.js
│   └── video
│       └── 0711.mp4
└── vite.config.js
```
