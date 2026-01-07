const express = require("express");
const router = express.Router();

const { createUser, getMe } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", createUser);
router.get("/me", protect, getMe);

module.exports = router;
