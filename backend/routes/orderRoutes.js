const express = require("express");
const router = express.Router();

const {
  addOrderItems,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
} = require("../controllers/orderController");

const { protect, admin } = require("../middleware/authMiddleware");

// Create order
router.post("/", protect, addOrderItems);

// Logged-in user's orders
router.get("/myorders", protect, getMyOrders);

// ADMIN: get all orders
router.get("/", protect, admin, getAllOrders);

// Get order by id (owner or admin)
router.get("/:id", protect, getOrderById);

// Mark order as paid (owner or admin)
router.put("/:id/pay", protect, updateOrderToPaid);

// ADMIN: mark order as delivered
router.put("/:id/deliver", protect, admin, updateOrderToDelivered);

module.exports = router;
