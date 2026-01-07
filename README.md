---

# 🛒 MERN E-Commerce Application

A full-stack **MERN (MongoDB, Express, React, Node.js)** e-commerce application featuring authentication, product management, and order processing. This project is built as a portfolio-grade implementation focusing on clean architecture, secure API design, and real-world development practices.

---

## ✨ Features

### Backend

* **User Authentication:** Secure login and registration using JWT.
* **Role-Based Authorization:** Separate permissions for Admins and Users.
* **Product Management:** Full CRUD (Create, Read, Update, Delete) functionality.
* **Order System:** Order creation and personalized order history.
* **Security:** Password hashing with `bcrypt` and protected routes.
* **Architecture:** Clean MVC (Model-View-Controller) structure.

### Frontend

* **React (Vite):** Fast, modern development environment.
* **Navigation:** Client-side routing with React Router.
* **State Management:** Axios-driven API layer.
* **UI/UX:** Responsive product listings and checkout flow.

---

## 🧱 Tech Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | React, Vite, Axios, React Router DOM |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Security** | JSON Web Token (JWT), bcrypt |

---

## 🔐 Environment Variables

Create a `.env` file inside the **backend** folder using the template below:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/v9mirza/mern-ecommerce.git
cd mern-ecommerce

```

### 2. Backend Setup

```bash
cd backend
npm install
# Create your .env file here
npm run dev

```

*Backend runs on: `http://localhost:5000*`

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev

```

*Frontend runs on: `http://localhost:5173*`

---

## 🔗 API Endpoints

### Auth & Users

* `POST /api/users/register` - Create a new account
* `POST /api/users/login` - Authenticate user & get token
* `GET /api/users/me` - Get current user profile

### Products

* `GET /api/products` - List all products
* `GET /api/products/:id` - Get single product details
* `POST /api/products` - Add new product (**Admin only**)

### Orders

* `POST /api/orders` - Place a new order
* `GET /api/orders/myorders` - Get logged-in user's history
* `GET /api/orders` - View all orders (**Admin only**)

---

## 📌 Project Status

* **Backend:** ✅ Complete
* **Frontend:** 🚧 Functional Core (In Progress)
* **Payments:** ❌ Not implemented
* **Deployment:** ❌ Not implemented

---

## 👤 Author

**Mirza** *Computer Science Student* Focused on MERN stack & backend architecture.

---

## 📜 License

This project is for educational and portfolio purposes.

---

