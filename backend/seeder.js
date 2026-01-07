const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

// sample products
const products = [
  {
    name: "Wireless Headphones",
    description: "High quality wireless headphones",
    price: 2999,
    image: "https://via.placeholder.com/300",
    countInStock: 10,
  },
  {
    name: "Smart Watch",
    description: "Fitness tracking smart watch",
    price: 4999,
    image: "https://via.placeholder.com/300",
    countInStock: 5,
  },
  {
    name: "Gaming Mouse",
    description: "RGB gaming mouse",
    price: 1499,
    image: "https://via.placeholder.com/300",
    countInStock: 20,
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // clear existing products
    await Product.deleteMany();

    // insert new products
    await Product.insertMany(products);

    console.log("Products seeded");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedProducts();
