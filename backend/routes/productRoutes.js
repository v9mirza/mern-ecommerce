const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect, admin } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const productSchema = {
  name: { required: true },
  description: { required: true },
  price: { required: true, isNumber: true, isPositive: true },
  image: { required: true },
  category: { required: true },
  countInStock: { required: true, isNumber: true },
};

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", protect, admin, validate(productSchema), createProduct);
router.put("/:id", protect, admin, validate(productSchema), updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
