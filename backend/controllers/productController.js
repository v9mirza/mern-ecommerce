const mongoose = require("mongoose");
const Product = require("../models/Product");

// GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product id" });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/products (admin)
exports.createProduct = async (req, res) => {
  const { name, description, price, image, countInStock } = req.body;

  try {
    const product = new Product({
      name,
      description,
      price,
      image,
      countInStock,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
