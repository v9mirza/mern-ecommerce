const express = require("express");
const router = express.Router();

const {
  addOrderItems,
  getMyOrders,
  getAllOrders,
} = require("../controllers/orderController");

const { protect, admin } = require("../middleware/authMiddleware");

// Create order
router.post("/", protect, addOrderItems);

// Logged-in user's orders
router.get("/myorders", protect, getMyOrders);

// ADMIN: get all orders
router.get("/", protect, admin, getAllOrders);

module.exports = router;
