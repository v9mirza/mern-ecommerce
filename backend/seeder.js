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
    image: "https://cdn.dummyjson.com/product-images/66/thumbnail.jpg",
    category: "Audio",
    countInStock: 10,
  },
  {
    name: "Smart Watch",
    description: "Fitness tracking smart watch",
    price: 4999,
    image: "https://cdn.dummyjson.com/product-images/105/thumbnail.jpg",
    category: "Wearables",
    countInStock: 5,
  },
  {
    name: "Gaming Mouse",
    description: "RGB gaming mouse",
    price: 1499,
    image: "https://cdn.dummyjson.com/product-images/87/thumbnail.jpg",
    category: "Accessories",
    countInStock: 20,
  },
  {
    name: "Bluetooth Earbuds",
    description: "Compact earbuds with noise isolation",
    price: 2199,
    image: "https://cdn.dummyjson.com/product-images/108/thumbnail.jpg",
    category: "Audio",
    countInStock: 25,
  },
  {
    name: "Portable Bluetooth Speaker",
    description: "Water resistant speaker with deep bass",
    price: 3299,
    image: "https://cdn.dummyjson.com/product-images/99/thumbnail.jpg",
    category: "Audio",
    countInStock: 14,
  },
  {
    name: "Mechanical Keyboard",
    description: "Tactile mechanical keyboard with backlight",
    price: 4599,
    image: "https://cdn.dummyjson.com/product-images/76/thumbnail.jpg",
    category: "Accessories",
    countInStock: 11,
  },
  {
    name: "4K Webcam",
    description: "Ultra HD webcam for streaming and meetings",
    price: 3899,
    image: "https://cdn.dummyjson.com/product-images/82/thumbnail.jpg",
    category: "Accessories",
    countInStock: 9,
  },
  {
    name: "USB-C Hub",
    description: "7-in-1 USB-C hub for laptops",
    price: 1999,
    image: "https://cdn.dummyjson.com/product-images/78/thumbnail.jpg",
    category: "Accessories",
    countInStock: 30,
  },
  {
    name: "External SSD 1TB",
    description: "High speed portable SSD storage",
    price: 8999,
    image: "https://cdn.dummyjson.com/product-images/96/thumbnail.jpg",
    category: "Storage",
    countInStock: 8,
  },
  {
    name: "Power Bank 20000mAh",
    description: "High capacity fast-charging power bank",
    price: 2799,
    image: "https://cdn.dummyjson.com/product-images/102/thumbnail.jpg",
    category: "Power",
    countInStock: 18,
  },
  {
    name: "Fast Charger 65W",
    description: "Dual port USB-C fast wall charger",
    price: 1699,
    image: "https://cdn.dummyjson.com/product-images/73/thumbnail.jpg",
    category: "Power",
    countInStock: 26,
  },
  {
    name: "Gaming Monitor 27-inch",
    description: "27 inch IPS monitor with 144Hz refresh rate",
    price: 28999,
    image: "https://cdn.dummyjson.com/product-images/79/thumbnail.jpg",
    category: "Displays",
    countInStock: 6,
  },
  {
    name: "Ergonomic Office Chair",
    description: "Adjustable chair with lumbar support",
    price: 15999,
    image: "https://cdn.dummyjson.com/product-images/91/thumbnail.jpg",
    category: "Furniture",
    countInStock: 4,
  },
  {
    name: "Aluminum Laptop Stand",
    description: "Portable stand for improved laptop posture",
    price: 1299,
    image: "https://cdn.dummyjson.com/product-images/95/thumbnail.jpg",
    category: "Furniture",
    countInStock: 22,
  },
  {
    name: "LED Desk Lamp",
    description: "Dimmable desk lamp with touch controls",
    price: 1199,
    image: "https://cdn.dummyjson.com/product-images/88/thumbnail.jpg",
    category: "Furniture",
    countInStock: 16,
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
