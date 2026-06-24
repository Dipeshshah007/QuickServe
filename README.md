# ⚡ QuickServe — Hyperlocal Food Delivery Platform

A production-grade full-stack food delivery web application built with React, Node.js, Express, and MongoDB.

![QuickServe Banner](https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop)

## 1. Problem Statement

**Real-world problem:** Customers in neighborhoods want fast, reliable access to food from local restaurants. Existing platforms:

- Charge excessive commission fees (25–35%) from restaurant partners
- Have slow, bloated apps with poor user experience
- Don't serve hyperlocal/smaller neighborhood restaurants
- Lack transparency in delivery tracking and pricing
- Create dependency on single mega-platforms

## 2. Our Solution

**QuickServe** is a hyperlocal food delivery platform designed to be:

- ✅ **Open & Deployable** — any restaurant operator can set up their own instance
- ✅ **Transparent Pricing** — flat delivery fees, no hidden markups
- ✅ **Lightweight & Fast** — optimized React frontend, sub-200ms API responses
- ✅ **Multi-Cuisine** — browse by cuisine type, dietary preferences (veg/vegan/GF)
- ✅ **Full Admin Control** — restaurant management, menu CRUD, order tracking
- ✅ **Real-time Order Flow** — pending → confirmed → preparing → out for delivery → delivered

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

# Clone from GitHub (after you push):
git clone https://github.com/YOUR_USERNAME/quickserve.git
cd quickserve
code .
```

---

### Step 2: Set Up MongoDB Atlas

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

### Step 4: Install Backend Dependencies & Seed Database

```bash
# Inside /backend folder:
npm install

# Seed the database with 6 restaurants + 36 menu items + admin user:
npm run seed
```

### Step 6: Configure Frontend Environment

Open a **new terminal**, then:

```bash
cd frontend
cp .env.example .env
```

### Step 7: Install Frontend Dependencies & Start

```bash
# Inside /frontend folder:
npm install

# Start the React app:
npm start
```-

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

