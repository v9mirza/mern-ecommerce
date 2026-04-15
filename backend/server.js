const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const setupAdmin = require("./admin/setup");

app.use(cors());
app.use(express.json());

// Set up AdminJS
setupAdmin(app);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

  app.use("/api/users", require("./routes/userRoutes"));
  app.use("/api/auth", require("./routes/authRoutes"));
  app.use("/api/products", require("./routes/productRoutes"));
  app.use("/api/orders", require("./routes/orderRoutes"));
  app.use("/api/cart", require("./routes/cartRoutes"));
  app.use("/api/wishlist", require("./routes/wishlistRoutes"));

// 404 Not Found handler (must be last)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
