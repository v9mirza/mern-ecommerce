---

## 🔐 Authentication & Users

```
POST   /api/users/register
```

→ Register a new user

```
POST   /api/users/login
```

→ Login user & receive JWT

```
GET    /api/users/me
```

→ Get logged-in user profile
**Auth required**

---

## 📦 Products

```
GET    /api/products
```

→ Get all products

```
GET    /api/products/:id
```

→ Get product by ID

```
POST   /api/products
```

→ Create new product
**Auth required + Admin only**

---

## 🛒 Orders

```
POST   /api/orders
```

→ Create a new order
**Auth required**

```
GET    /api/orders/myorders
```

→ Get logged-in user’s orders
**Auth required**

```
GET    /api/orders
```

→ Get all orders
**Auth required + Admin only**

---

## 🔑 Common Headers

For all protected routes:

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

##️## 🧠 Notes (important, but brief)

* JWT is required for all `/orders` routes
* Admin routes check `isAdmin === true`
* Prices are validated/calculated server-side
* Products and users are real DB entities (no mocks)

---

