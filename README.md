# DevCart

Modern full-stack e-commerce app for a tech store — browse products, manage cart & wishlist, checkout, and run the store from an admin panel with sales analytics.

## What's included

**Storefront** — bento hero · catalog with live search & suggestions · category filters & sort · product details · cart & wishlist · checkout · profile & order history · responsive mobile layout

**Backend** — REST API · JWT auth · MongoDB · cart & wishlist sync · role-based admin routes · [API reference](backend/API.md)

**Admin** — [AdminJS](https://adminjs.co/) panel for products, categories, orders, users, carts, and wishlists · analytics dashboard (revenue, orders, top products, fulfillment stats) · mark orders paid / delivered

## Stack

React · Vite · Tailwind CSS · Node.js · Express · MongoDB · JWT · AdminJS · Recharts

## Get started

**Prerequisites:** Node.js (LTS) · MongoDB (local or [Atlas](https://www.mongodb.com/atlas))

```bash
# 1. Environment
cp backend/.env.example backend/.env
# Edit backend/.env — MONGO_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, SESSION_SECRET

# 2. Backend
cd backend && npm install && npm run dev

# 3. Frontend (new terminal)
cd frontend && npm install && npm run dev

# 4. Sample data (optional)
cd backend && npm run seed
```

## URLs

| | |
|---|---|
| Store | http://localhost:5173 |
| API | http://localhost:5000 |
| Admin | http://localhost:5000/admin |

Sign in to admin with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from your `.env`.

## Scripts

```bash
# Backend
npm run dev      # dev server
npm run start    # production
npm run seed     # reset & seed database

# Frontend
npm run dev      # Vite dev server
npm run build    # production build
```
