# ⚡ QuickServe — Hyperlocal Food Delivery Platform

> A production-grade full-stack food delivery web application built with React, Node.js, Express, and MongoDB.
> Inspired by Swiggy, Zomato, UberEats, GrubHub & DoorDash.

![QuickServe Banner](https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop)

---

## 📋 Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Our Solution](#2-our-solution)
3. [End Users](#3-end-users)
4. [System Architecture & Scalability](#4-system-architecture--scalability)
5. [Cost Effectiveness & Future Scope](#5-cost-effectiveness--future-scope)
6. [Functional & Non-Functional Requirements](#6-functional--non-functional-requirements)
7. [Tech Stack](#7-tech-stack)
8. [Project Structure](#8-project-structure)
9. [Setup & Installation](#9-setup--installation)
10. [API Reference](#10-api-reference)
11. [Features](#11-features)
12. [GitHub Setup](#12-github-setup)

---

## 1. Problem Statement

**Real-world problem:** Customers in neighborhoods want fast, reliable access to food from local restaurants. Existing platforms:

- Charge excessive commission fees (25–35%) from restaurant partners
- Have slow, bloated apps with poor user experience
- Don't serve hyperlocal/smaller neighborhood restaurants
- Lack transparency in delivery tracking and pricing
- Create dependency on single mega-platforms

**Impact:** Small restaurants lose customers and margins. Consumers pay inflated prices. Neighborhoods lose food diversity.

---

## 2. Our Solution

**QuickServe** is a hyperlocal food delivery platform designed to be:

- ✅ **Open & Deployable** — any restaurant operator can set up their own instance
- ✅ **Transparent Pricing** — flat delivery fees, no hidden markups
- ✅ **Lightweight & Fast** — optimized React frontend, sub-200ms API responses
- ✅ **Multi-Cuisine** — browse by cuisine type, dietary preferences (veg/vegan/GF)
- ✅ **Full Admin Control** — restaurant management, menu CRUD, order tracking
- ✅ **Real-time Order Flow** — pending → confirmed → preparing → out for delivery → delivered

---

## 3. End Users

| User Type         | Description                                                          |
|-------------------|----------------------------------------------------------------------|
| **Customers**     | Hungry users who browse restaurants, add items to cart, and order    |
| **Admins**        | Platform operators who manage restaurants, menus, users, and orders  |
| **Restaurant Owners** | (Future) Self-service dashboard for partner restaurants          |
| **Delivery Agents**   | (Future) Dedicated mobile app for delivery personnel             |

**Demographics:**
- Age: 18–45, urban/suburban users
- Tech-savvy, mobile-first behavior
- Values speed, variety, and reliable tracking

---

## 4. System Architecture & Scalability

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                                      │
│  ┌──────────────────────┐    ┌────────────────────────────────────┐     │
│  │   React.js SPA       │    │   Admin React Dashboard            │     │
│  │   (Customer UI)      │    │   (CRUD + Analytics)               │     │
│  │   ─────────────────  │    │   ─────────────────────────────    │     │
│  │   • Home/Browse      │    │   • Dashboard (Stats + Charts)     │     │
│  │   • Restaurant Page  │    │   • Manage Restaurants             │     │
│  │   • Cart & Checkout  │    │   • Manage Menu Items              │     │
│  │   • Order Tracking   │    │   • Update Order Status            │     │
│  │   • User Profile     │    │   • Manage Users                   │     │
│  └──────────┬───────────┘    └────────────────┬───────────────────┘     │
└─────────────┼──────────────────────────────────┼───────────────────────┘
              │  HTTPS + JSON REST API            │
              ▼                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        API GATEWAY LAYER                                 │
│   Node.js + Express.js                                                   │
│   ┌────────────────────────────────────────────────────────────────┐     │
│   │   JWT Auth Middleware  →  Route Guards (protect / authorize)   │     │
│   │   CORS  │  Rate Limiting  │  Request Validation               │     │
│   └────────────────────────────────────────────────────────────────┘     │
│                                                                           │
│   REST Routes:                                                            │
│   /api/auth          /api/restaurants    /api/menu                       │
│   /api/cart          /api/orders         /api/admin                      │
│   /api/payment       /api/categories     /api/users                      │
└───────────────────────────────────────┬─────────────────────────────────┘
                                        │  Mongoose ODM
                                        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                        │
│   MongoDB Atlas (Free Tier → M0 → M10 → M30 as scale grows)            │
│                                                                           │
│   Collections:                                                            │
│   ┌────────────┐ ┌──────────────┐ ┌──────────┐ ┌───────┐ ┌──────────┐  │
│   │   users    │ │ restaurants  │ │ menuItems│ │ carts │ │  orders  │  │
│   └────────────┘ └──────────────┘ └──────────┘ └───────┘ └──────────┘  │
└─────────────────────────────────────────────────────────────────────────┘

SCALABILITY PATH:
Current (Free Tier):  MongoDB Atlas M0 + Render/Railway Free + Vercel Free
   → 100 concurrent users
Level 2 (Paid Tier): Atlas M10 + Render Starter + Redis Cache
   → 1,000 concurrent users
Level 3 (Production): Atlas M30 + Load Balancer + Redis + CDN + WebSockets
   → 100,000+ concurrent users
```

### Scalability Decisions Made

| Decision               | Chosen Approach        | Why                                          |
|------------------------|------------------------|----------------------------------------------|
| **Auth**               | JWT (stateless)        | Horizontal scaling without session stores     |
| **Database**           | MongoDB                | Flexible schema, easy horizontal sharding     |
| **API Design**         | REST with pagination   | Prevents large payload dumps                  |
| **Indexes**            | Compound indexes       | Fast queries on restaurant, order lookups     |
| **Images**             | External URL (Unsplash)| Avoids file storage cost in MVP               |

---

## 5. Cost Effectiveness & Future Scope

### 💰 Free Tier Deployment Stack (₹0 / $0 to start)

| Service            | Free Tier             | Limits                          |
|--------------------|-----------------------|---------------------------------|
| MongoDB Atlas      | M0 Cluster            | 512MB storage, shared RAM       |
| Render.com         | Free Web Service      | 750 hrs/month, sleeps on idle   |
| Vercel             | Hobby Plan            | 100GB bandwidth, unlimited deploys |
| Stripe             | Test Mode             | Unlimited test transactions     |

### 🚀 Future Scope

1. **Real-time Delivery Tracking** — Socket.io for live GPS tracking
2. **Mobile App** — React Native wrapper (same backend)
3. **Restaurant Partner Portal** — Self-service restaurant onboarding
4. **Delivery Agent App** — Accept/reject deliveries, navigation
5. **AI Recommendations** — ML-based dish recommendations
6. **Push Notifications** — Order status via FCM
7. **Multi-Language** — i18n support
8. **Loyalty Points System** — Gamified rewards
9. **Dark Kitchen Support** — Cloud kitchen management
10. **Analytics Dashboard** — Revenue charts, heat maps

---

## 6. Functional & Non-Functional Requirements

### ✅ Functional Requirements

**Customer:**
- Register/Login with JWT authentication
- Browse restaurants by cuisine, city, name search
- View restaurant details and full menu (categorized)
- Add/remove/update items in cart (enforces single-restaurant cart)
- Checkout with delivery address + payment method selection
- View order history with real-time status display
- Cancel pending/confirmed orders
- Manage saved delivery addresses
- Update profile and change password

**Admin:**
- Secure admin login with role-based access
- Dashboard with key metrics (users, orders, revenue, weekly chart)
- Full CRUD for restaurants (create, edit, deactivate)
- Full CRUD for menu items (per restaurant, with all attributes)
- View and update order status in real-time
- User management (view, search, suspend accounts)

### ⚡ Non-Functional Requirements

| Category         | Requirement                                        |
|------------------|----------------------------------------------------|
| **Performance**  | API responses < 300ms for cached queries            |
| **Security**     | JWT auth, bcrypt password hashing, CORS protection  |
| **Reliability**  | Mongoose validation, error middleware, try/catch     |
| **Scalability**  | Stateless API, indexed MongoDB, pagination everywhere|
| **Usability**    | Responsive design (mobile + desktop), accessible UI |
| **Maintainability** | Modular MVC architecture, separated concerns    |

---

## 7. Tech Stack

| Layer      | Technology               | Purpose                                      |
|------------|--------------------------|----------------------------------------------|
| Frontend   | React 18 + React Router 6| SPA, client-side routing                      |
| Styling    | CSS Modules + Custom CSS  | Scoped styles, no CSS conflicts               |
| HTTP       | Axios                    | API calls with interceptors                   |
| State      | React Context API        | Auth + Cart global state                      |
| Toasts     | React Hot Toast          | User notifications                            |
| Icons      | React Icons (FI set)     | Consistent icon library                       |
| Backend    | Node.js + Express.js     | REST API server                               |
| Database   | MongoDB + Mongoose       | Document database with schema validation      |
| Auth       | JWT + bcryptjs           | Stateless auth + secure password hashing      |
| Validation | express-validator        | Request body validation                       |
| Payment    | Stripe (test mode)       | Payment processing (demo)                     |

---

## 8. Project Structure

```
quickserve/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Business logic
│   │   │   ├── auth.controller.js
│   │   │   ├── restaurant.controller.js
│   │   │   ├── menu.controller.js
│   │   │   ├── order.controller.js
│   │   │   ├── cart.controller.js
│   │   │   └── admin.controller.js
│   │   ├── models/            # Mongoose schemas
│   │   │   ├── User.model.js
│   │   │   ├── Restaurant.model.js
│   │   │   ├── MenuItem.model.js
│   │   │   ├── Order.model.js
│   │   │   └── Cart.model.js
│   │   ├── routes/            # Express routes
│   │   │   ├── auth.routes.js
│   │   │   ├── restaurant.routes.js
│   │   │   ├── menu.routes.js
│   │   │   ├── order.routes.js
│   │   │   ├── cart.routes.js
│   │   │   ├── admin.routes.js
│   │   │   ├── payment.routes.js
│   │   │   └── category.routes.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   ├── seed/
│   │   │   └── seedData.js    # Demo data (6 restaurants + 36 menu items)
│   │   └── server.js          # Entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/        # Navbar, Footer
│   │   │   ├── Customer/      # RestaurantCard, MenuItemCard
│   │   │   └── Admin/         # AdminLayout
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── CartContext.js
│   │   ├── pages/
│   │   │   ├── customer/      # HomePage, RestaurantsPage, RestaurantPage,
│   │   │   │                  # CartPage, CheckoutPage, OrdersPage,
│   │   │   │                  # OrderDetailPage, ProfilePage
│   │   │   ├── admin/         # AdminDashboard, AdminRestaurants,
│   │   │   │                  # AdminMenu, AdminOrders, AdminUsers
│   │   │   ├── LoginPage.js
│   │   │   └── RegisterPage.js
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 9. Setup & Installation

### Prerequisites

Make sure you have these installed:
- **Node.js** v18+ → https://nodejs.org
- **VS Code** → https://code.visualstudio.com
- **Git** → https://git-scm.com
- **MongoDB Atlas account** (free) → https://cloud.mongodb.com

---

### Step 1: Clone / Open the Project

```bash
# If you downloaded the ZIP, extract it, then open VS Code:
code quickserve

# OR clone from GitHub (after you push):
git clone https://github.com/YOUR_USERNAME/quickserve.git
cd quickserve
code .
```

---

### Step 2: Set Up MongoDB Atlas (Free)

1. Go to https://cloud.mongodb.com → Sign up (free)
2. Create a **Free Cluster** (M0 — no credit card needed)
3. Go to **Database Access** → Add a database user with password
4. Go to **Network Access** → Add IP `0.0.0.0/0` (allow all for dev)
5. Go to **Connect** → **Connect your application** → Copy the connection string
6. It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`

---

### Step 3: Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` in VS Code and fill in:

```env
PORT=5000
NODE_ENV=development

# Paste your MongoDB Atlas URI (replace <username> and <password>)
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/quickserve?retryWrites=true&w=majority

# Any long random string for JWT
JWT_SECRET=my_super_secret_key_make_this_very_long_and_random_123456
JWT_EXPIRES_IN=7d

# Stripe test keys (get free from stripe.com → dashboard → developers → API keys)
STRIPE_SECRET_KEY=sk_test_your_key_here

FRONTEND_URL=http://localhost:3000
ADMIN_EMAIL=admin@quickserve.com
ADMIN_PASSWORD=Admin@123
```

---

### Step 4: Install Backend Dependencies & Seed Database

```bash
# Inside /backend folder:
npm install

# Seed the database with 6 restaurants + 36 menu items + admin user:
npm run seed
```

You should see:
```
✅ Connected to MongoDB
🗑️  Cleared existing data
✅ Created 6 restaurants
✅ Created 36 menu items
🎉 Database seeded successfully!

📧 Admin:    admin@quickserve.com  | Password: Admin@123
📧 Customer: customer@quickserve.com | Password: Customer@123
```

---

### Step 5: Start Backend Server

```bash
# Still in /backend:
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 QuickServe API running on http://localhost:5000
```

Test it: Open http://localhost:5000/api/health in your browser.
You should see: `{"status":"OK","message":"QuickServe API is running"}`

---

### Step 6: Configure Frontend Environment

Open a **new terminal**, then:

```bash
cd frontend
cp .env.example .env
```

Open `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_stripe_publishable_key
```

---

### Step 7: Install Frontend Dependencies & Start

```bash
# Inside /frontend folder:
npm install

# Start the React app:
npm start
```

The browser will open at **http://localhost:3000** automatically.

---

### Step 8: Test the Application

#### As a Customer:
1. Go to http://localhost:3000
2. Click **"Try as Customer"** on login page → auto-fills demo credentials
3. Login → Browse restaurants → Open Mario's Pizzeria
4. Add items to cart → Go to cart → Checkout
5. Fill address → Choose payment → Place order
6. View order in **My Orders**

#### As Admin:
1. Click **"Try as Admin"** on login page
2. Login → Redirected to `/admin`
3. Dashboard: View stats and recent orders
4. Go to **Orders** → Update order status from dropdown
5. Go to **Restaurants** → Add/Edit restaurants
6. Go to **Menu Items** → Select restaurant → CRUD menu items

---

### Both Servers Running:

```
Terminal 1 (Backend):   cd backend  && npm run dev    → http://localhost:5000
Terminal 2 (Frontend):  cd frontend && npm start       → http://localhost:3000
```

---

## 10. API Reference

### Auth Endpoints
| Method | Endpoint                  | Auth | Description              |
|--------|---------------------------|------|--------------------------|
| POST   | /api/auth/register        | ❌   | Register new user         |
| POST   | /api/auth/login           | ❌   | Login                     |
| GET    | /api/auth/me              | ✅   | Get current user          |
| PUT    | /api/auth/update-profile  | ✅   | Update profile            |
| PUT    | /api/auth/change-password | ✅   | Change password           |
| POST   | /api/auth/add-address     | ✅   | Add delivery address      |

### Restaurant Endpoints
| Method | Endpoint              | Auth  | Description              |
|--------|-----------------------|-------|--------------------------|
| GET    | /api/restaurants      | ❌    | List all (with filters)  |
| GET    | /api/restaurants/:id  | ❌    | Get one + full menu      |
| POST   | /api/restaurants      | Admin | Create restaurant        |
| PUT    | /api/restaurants/:id  | Admin | Update restaurant        |
| DELETE | /api/restaurants/:id  | Admin | Deactivate restaurant    |

### Order Endpoints
| Method | Endpoint               | Auth  | Description              |
|--------|------------------------|-------|--------------------------|
| POST   | /api/orders            | ✅    | Place order from cart    |
| GET    | /api/orders/my         | ✅    | My order history         |
| GET    | /api/orders/:id        | ✅    | Order details            |
| PUT    | /api/orders/:id/cancel | ✅    | Cancel order             |
| GET    | /api/orders/admin/all  | Admin | All orders (admin)       |
| PUT    | /api/orders/:id/status | Admin | Update order status      |

---

## 11. Features

### Customer Features
- 🏠 **Hero Landing Page** with animated search bar
- 🍽️ **12 Cuisine Categories** with emoji icons and color coding
- 🏪 **Restaurant Cards** with ratings, delivery time, fees
- 📖 **Restaurant Detail** with sidebar category nav + veg filter
- 🛒 **Persistent Cart** with real-time quantity controls
- 🛍️ **Multi-Step Checkout** (Address → Payment → Review → Success)
- 📦 **Order Tracking** with visual timeline (5 stages)
- 👤 **Profile Management** (info, password, addresses)
- 📱 **Fully Responsive** mobile + desktop
- 🔐 **JWT Auth** with protected routes

### Admin Features
- 📊 **Dashboard** with stat cards + weekly bar chart + recent orders table
- 🏪 **Restaurant CRUD** with form modal (all fields)
- 🍔 **Menu Item CRUD** with per-restaurant filtering
- 📦 **Order Management** with inline status dropdown updates
- 👥 **User Management** with search, filter, suspend/activate

### Technical Features
- Context API for global auth + cart state
- Axios interceptors for auth headers + 401 redirect
- CSS Modules for zero style conflicts
- MVC pattern on backend (controllers/models/routes)
- Mongoose middleware for password hashing + order number generation
- Compound indexes for fast database queries
- Seed script for instant demo data

---

## 12. GitHub Setup

### Push to GitHub (First Time)

```bash
# In the root quickserve/ folder:
git init
git add .
git commit -m "feat: QuickServe - Full Stack Food Delivery Platform

- React 18 frontend with React Router 6
- Node.js + Express.js REST API
- MongoDB + Mongoose data layer
- JWT authentication with role-based access
- Customer: browse, cart, checkout, order tracking
- Admin: dashboard, CRUD for restaurants/menu/orders/users
- 6 seeded restaurants with 36 menu items
- Fully responsive mobile-first design"

# Create repo on github.com → copy the URL, then:
git remote add origin https://github.com/YOUR_USERNAME/quickserve.git
git branch -M main
git push -u origin main
```

### Recommended GitHub Repository Settings

- **Description:** `⚡ QuickServe — Full-Stack Hyperlocal Food Delivery Platform | React + Node.js + Express + MongoDB | JWT Auth | Admin Dashboard`
- **Topics:** `react` `nodejs` `mongodb` `expressjs` `food-delivery` `fullstack` `jwt` `portfolio`
- **README:** This file (already included)

### Deploy for Free (Optional)

**Backend → Render.com:**
1. Go to render.com → New Web Service
2. Connect GitHub → Select this repo
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add all `.env` variables in Render's dashboard

**Frontend → Vercel:**
1. Go to vercel.com → Import Project
2. Connect GitHub → Select this repo
3. Root directory: `frontend`
4. Framework preset: `Create React App`
5. Add `REACT_APP_API_URL=https://your-render-url.onrender.com/api`

---

## Demo Credentials

| Role     | Email                       | Password       |
|----------|-----------------------------|----------------|
| Admin    | admin@quickserve.com        | Admin@123      |
| Customer | customer@quickserve.com     | Customer@123   |

> **Note:** The login page has "Try as Customer" and "Try as Admin" buttons that auto-fill these credentials!

---

## License

MIT License — Free to use, modify, and distribute for portfolio and commercial projects.

---

**Built with ❤️ as a Full-Stack Portfolio Project**
*React · Node.js · Express · MongoDB · JWT*
