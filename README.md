# DevCart Backend

DevCart is a backend-only e-commerce API built with Node.js, Express, and MongoDB.

## What is built

- JWT auth (register, login, protected profile)
- Role-based access (user/admin)
- Product APIs (list, get by id, create, update, delete)
- Order APIs (create, my orders, get by id, mark paid, admin list all, mark delivered)
- Product seeder with sample data
- MVP test scripts for health, auth, products, and orders

## Tech stack

- Node.js
- Express
- MongoDB + Mongoose
- bcryptjs + jsonwebtoken

## Environment

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/devcart
JWT_SECRET=replace_with_a_long_random_secret
API_BASE_URL=http://localhost:5000
TEST_USER_NAME=MVP Test User
TEST_USER_EMAIL=devcart.user@example.com
TEST_USER_PASSWORD=password123
TEST_ADMIN_NAME=MVP Test Admin
TEST_ADMIN_EMAIL=devcart.admin@example.com
TEST_ADMIN_PASSWORD=adminpass123
```

## Run locally

```bash
cd backend
npm install
npm run dev
```

## Seed products

```bash
cd backend
npm run seed
```

## Test the MVP flows

```bash
cd backend
npm run test:mvp
```

You can also run them individually:

- `npm run test:health`
- `npm run test:auth`
- `npm run test:products`
- `npm run test:orders`

## Main API routes

- `GET /api/health`
- `POST /api/users`
- `GET /api/users/me`
- `POST /api/auth/login`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)
- `POST /api/orders`
- `GET /api/orders/myorders`
- `GET /api/orders/:id`
- `PUT /api/orders/:id/pay`
- `GET /api/orders` (admin)
- `PUT /api/orders/:id/deliver` (admin)
