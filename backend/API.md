---

## 🔐 Authentication & Users

```
POST   /api/users
```

→ Register a new user

```
POST   /api/auth/login
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

Optional query:

```
GET    /api/products?category=Audio
```

→ Get products by exact category match

```
GET    /api/products/:id
```

→ Get product by ID

```
POST   /api/products
```

→ Create new product
**Auth required + Admin only**

Required fields: `name`, `description`, `price`, `image`, `category`, `countInStock`

---

## 🛒 Orders

```
POST   /api/orders
```

→ Create a new order from the logged-in user's cart
**Auth required**

Required body:

```json
{
  "shippingAddress": {
    "address": "123 Street",
    "city": "Mumbai",
    "postalCode": "400001",
    "country": "India"
  },
  "paymentMethod": "Cash On Delivery"
}
```

Behavior:

- Uses current `/api/cart` items as order items
- Calculates pricing server-side (`itemsPrice`, `taxPrice`, `shippingPrice`, `totalPrice`)
- Decrements product stock (`countInStock`)
- Clears cart after successful order creation

```
GET    /api/orders/myorders
```

→ Get logged-in user’s orders
**Auth required**

```
GET    /api/orders/:id
```

→ Get a single order by id (owner or admin)
**Auth required**

```
PUT    /api/orders/:id/pay
```

→ Mark an order as paid (owner or admin)
**Auth required**

```
GET    /api/orders
```

→ Get all orders
**Auth required + Admin only**

```
PUT    /api/orders/:id/deliver
```

→ Mark an order as delivered
**Auth required + Admin only**

---

## 🛒 Cart

```
GET    /api/cart
POST   /api/cart
PUT    /api/cart/:productId
DELETE /api/cart/:productId
DELETE /api/cart
```

→ Get/add/update/remove/clear logged-in user's cart
**Auth required**

---

## ❤️ Wishlist

```
GET    /api/wishlist
POST   /api/wishlist/toggle
DELETE /api/wishlist
```

→ Get/toggle/clear logged-in user's wishlist
**Auth required**

---

## 🔑 Common Headers

For all protected routes:

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## 🧠 Notes (important, but brief)

* JWT is required for all `/orders` routes
* Admin routes check `isAdmin === true`
* `/api/orders` now reads items from cart and calculates prices server-side
* Products and users are real DB entities (no mocks)

---
