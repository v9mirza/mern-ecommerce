# MERN E-Commerce Application

A full-stack e-commerce application built with MongoDB, Express, React, and Node.js. Features user authentication, product management, and order processing.

## Features

- **User Authentication:** JWT-based login/register with role-based access (Admin/User).
- **Product Management:** CRUD operations for products.
- **Order System:** Order creation and history viewing.
- **Security:** Password hashing (bcrypt) and protected routes.

## Tech Stack

- **Frontend:** React, Vite, Axios, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose

## Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

## Getting Started

1. **Clone:** `git clone https://github.com/v9mirza/mern-ecommerce.git`
2. **Backend:**
   ```bash
   cd backend && npm install
   npm run dev
   ```
3. **Frontend:**
   ```bash
   cd frontend && npm install
   npm run dev
   ```

## API Endpoints

- **Auth:** `/api/users/register`, `/api/users/login`, `/api/users/me`
- **Products:** `/api/products` (GET, POST), `/api/products/:id` (GET)
- **Orders:** `/api/orders` (POST, GET), `/api/orders/myorders`


## License

Educational/Portfolio use.
