const express = require("express");
const { createUser } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// public route
router.post("/", createUser);

// protected test route
router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

module.exports = router;
