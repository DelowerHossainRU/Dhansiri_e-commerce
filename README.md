# DHANSIRI AGRO INDUSTRIES LTD. (ধানসিঁড়ি এগ্রো)
### Premium Rice Agribusiness & Enterprise FMCG Digital Platform

A full-stack, enterprise-grade digital operating platform for an established rice mill and grain merchant company. Built for direct consumer retail, restaurant & hotel supply (HORECA), supermarket distribution, regional dealer networks, and institutional procurement across Bangladesh.

---

## 🌾 Platform Highlights

- **Aesthetic Direction**: Clean + Minimal + Premium + Trustworthy + Human + Corporate + Modern + Functional. No generic AI templates, gradients, or fake cards.
- **Pure JavaScript Stack**: 100% JavaScript (NO TypeScript).
- **Backend Architecture**: Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt, Multer, Nodemailer.
- **Frontend Architecture**: React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide React, TanStack Query, Axios, Sonner.
- **Layered Enterprise Pattern**: `Routes → Controllers → Services → Models`.
- **Bangladeshi Agribusiness Focus**:
  - Currency: Bangladeshi Taka (`৳` BDT).
  - Authentic cultivars: Dinajpur Chinigura Aromatic, Sherpur Kalijira, Supreme Auto-Milled Miniket, Aged Barishal Nazirshail, Organic Red Brown Rice, Himalayan Aged Basmati.
  - Multi-tiered pricing: Retail price, B2B wholesale rate, distributor tier rate.
  - Sizing variants: 1kg, 2kg, 5kg (Food-grade Jute / Vacuum Foil), 10kg, 25kg, and 50kg Master Sacks.
  - Real-time order tracking: Stepper status pipeline (`Pending` → `Delivered`) with airway bill references.
  - Multi-warehouse readiness: Dinajpur Processing Silos & Tejgaon Greater Dhaka Distribution Hub.

---

## 📁 Repository Structure

```
dhansiri-agro/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, Constants, Environment
│   │   ├── controllers/     # Auth, Products, Catalog, Cart, Orders, Inventory, Wholesale, CMS, Admin
│   │   ├── middleware/      # Auth (RBAC), Error Handler, Upload (Multer)
│   │   ├── models/          # 20+ Mongoose Models (User, Product, Order, Inventory, Invoice, etc.)
│   │   ├── routes/          # Clean REST API Routes
│   │   ├── scripts/         # Realistic Database Seeder
│   │   ├── services/        # Business Logic Layer
│   │   ├── utils/           # Standard API Response Helper, JWT Tokens
│   │   ├── app.js           # Express App Configuration
│   │   └── server.js        # Server Entry Point
│   ├── test/                # Node.js built-in automated test suite
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios Client with token and guest session tracking
│   │   ├── components/      # Common UI, Cards, Cart Drawer, Navbar, Footer
│   │   ├── context/         # AuthContext, CartContext, WishlistContext
│   │   ├── layouts/         # MainLayout, AdminLayout
│   │   ├── pages/
│   │   │   ├── public/      # Home, Quality, Sourcing, About, Distributors, Contact, Faq, Blog, Legal
│   │   │   ├── shop/        # Shop Catalog, Product Detail, Checkout, Tracking
│   │   │   ├── customer/    # Login, Register, Account Dashboard, Wishlist
│   │   │   ├── wholesale/   # B2B Portal, Wholesale Dashboard
│   │   │   └── admin/       # Executive Overview, Products, Orders, Inventory, Purchases, Suppliers, etc.
│   │   ├── utils/           # Formatters (BDT currency, dates, metric tons)
│   │   ├── App.jsx          # Route Mapping
│   │   ├── main.jsx
│   │   └── index.css        # Tailwind v4 Brand Theme & Typography
│   ├── vite.config.js
│   └── package.json
│
├── ecosystem.config.js       # PM2 Cluster Production Config
└── README.md
```

---

## 🚀 Quick Start & Development Setup

### 1. Prerequisites
- **Node.js**: v20+ or v22+
- **MongoDB**: v6+ or v7+ running on `localhost:27017`

### 2. Backend Setup
```bash
cd backend
npm install

# Configure environment (pre-configured .env already created)
cp .env.example .env

# Seed MongoDB with authentic Bangladeshi cultivars, suppliers & orders
npm run seed

# Run automated tests
npm test

# Start Backend Server (runs on http://localhost:5000)
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Start Vite Frontend Dev Server (runs on http://localhost:5173)
npm run dev

# Build production bundle
npm run build
```

---

## 🔑 Default Seeded Accounts

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@dhansiriagro.com` | `AdminPassword2026!` | Full Executive Admin & Silo Control |
| **Staff / Warehouse** | `staff@dhansiriagro.com` | `StaffPassword2026!` | Inventory & PO Management |
| **Retail Customer** | `customer@dhansiriagro.com` | `Customer2026!` | Retail Store, Orders, Wishlist |
| **B2B Wholesale** | `b2b@dhansiriagro.com` | `Wholesale2026!` | B2B Portal, Bulk Sacks, Quotations |

*(Tip: The Login page includes one-click demo credentials buttons for instant testing.)*

---

## 📦 Critical Modules Implemented

1. **Product Catalog**: Multi-variant packs (1kg to 50kg), optical sortex grade, moisture stats, tier-based pricing.
2. **Shopping Cart & Checkout**: Stock reservation, guest session support, free delivery meter (৳2,500 threshold), coupon discount engine, multi-step checkout.
3. **Order Management & Invoicing**: Formatted order numbers (`DHA-YYMMDD-XXXX`), commercial invoice generation (`INV-YYMMDD-XXXX`), and live carrier tracking timeline.
4. **Warehouse & Procurement**: Multi-silo inventory, stock adjustment write-offs, raw paddy Purchase Orders from farmer cooperatives, and automatic inventory intake.
5. **Wholesale & B2B Portal**: Interactive commercial quotation requests, B2B credit approval underwriting, and Trade License validation.
6. **Executive Admin Dashboard**: Real aggregated MongoDB revenue telemetry, monthly sales metrics, low stock warnings, and audit trail logs.

---

## 🛡️ Production Deployment Guide (Ubuntu VPS / Nginx / PM2)

### 1. Build Frontend
```bash
cd frontend
npm run build
# Built files located in frontend/dist/
```

### 2. Configure Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name dhansiriagro.com www.dhansiriagro.com;

    # Frontend Static SPA
    location / {
        root /home/delower-hossain/Documents/My\ Personal\ Project/dhansiri-agro/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API Reverse Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Uploaded media documents
    location /uploads/ {
        alias /home/delower-hossain/Documents/My\ Personal\ Project/dhansiri-agro/backend/src/uploads/;
        expires 30d;
    }
}
```

### 3. Launch Backend with PM2
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. Database Backup & Disaster Recovery
```bash
# Automated Daily MongoDB Backup
mongodump --db dhansiri_agro --out /var/backups/mongodb/$(date +%F)

# Restoration
mongorestore --db dhansiri_agro /var/backups/mongodb/2026-10-10/dhansiri_agro
```

# Dhansiri_e-commerce
