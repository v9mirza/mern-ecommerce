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

  if (!name || !description || !image) {
    return res.status(400).json({ message: "Name, description, and image are required" });
  }

  if (typeof price !== "number" || price < 0) {
    return res.status(400).json({ message: "Price must be a non-negative number" });
  }

  if (typeof countInStock !== "number" || countInStock < 0) {
    return res.status(400).json({ message: "Stock must be a non-negative number" });
  }

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

// PUT /api/products/:id (admin)
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image, countInStock } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product id" });
  }

  if (!name || !description || !image) {
    return res.status(400).json({ message: "Name, description, and image are required" });
  }

  if (typeof price !== "number" || price < 0) {
    return res.status(400).json({ message: "Price must be a non-negative number" });
  }

  if (typeof countInStock !== "number" || countInStock < 0) {
    return res.status(400).json({ message: "Stock must be a non-negative number" });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = name;
    product.description = description;
    product.price = price;
    product.image = image;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/products/:id (admin)
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product id" });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
