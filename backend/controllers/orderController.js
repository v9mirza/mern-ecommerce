const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const mongoose = require("mongoose");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.addOrderItems = async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  if (!shippingAddress?.address || !shippingAddress?.city || !shippingAddress?.postalCode || !shippingAddress?.country) {
    return res.status(400).json({ message: "Shipping address is required" });
  }

  if (!paymentMethod) {
    return res.status(400).json({ message: "Payment method is required" });
  }

  const createOrderFromCart = async (session = null) => {
    const cartQuery = Cart.findOne({ user: req.user._id });
    const cart = session ? await cartQuery.session(session) : await cartQuery;
    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    const productIds = cart.items.map((item) => item.product);
    const productsQuery = Product.find({ _id: { $in: productIds } });
    const products = session ? await productsQuery.session(session) : await productsQuery;
    const productMap = new Map(products.map((product) => [product._id.toString(), product]));

    const orderItems = [];
    let itemsPrice = 0;

    for (const item of cart.items) {
      const product = productMap.get(item.product.toString());
      if (!product) {
        throw new Error("One or more products are no longer available");
      }

      if (product.countInStock < item.qty) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      orderItems.push({
        name: product.name,
        qty: item.qty,
        image: product.image,
        price: product.price,
        product: product._id,
      });

      itemsPrice += product.price * item.qty;
    }

    const taxPrice = 0;
    const shippingPrice = itemsPrice > 0 ? 100 : 0;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    const stockOps = cart.items.map((item) => ({
      updateOne: {
        filter: { _id: item.product, countInStock: { $gte: item.qty } },
        update: { $inc: { countInStock: -item.qty } },
      },
    }));

    let createdOrder;
    if (session) {
      [createdOrder] = await Order.create(
        [
          {
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
          },
        ],
        { session }
      );
    } else {
      createdOrder = await Order.create({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });
    }

    const stockResult = session
      ? await Product.bulkWrite(stockOps, { session })
      : await Product.bulkWrite(stockOps);
    if (stockResult.modifiedCount !== stockOps.length) {
      throw new Error("Failed to reserve stock for all items");
    }

    cart.items = [];
    if (session) {
      await cart.save({ session });
    } else {
      await cart.save();
    }

    return createdOrder;
  };

  try {
    let createdOrder;
    let session;

    try {
      session = await mongoose.startSession();
      session.startTransaction();
      createdOrder = await createOrderFromCart(session);
      await session.commitTransaction();
    } catch (err) {
      const isTransactionNotSupported = err instanceof Error && err.message.includes("Transaction numbers are only allowed");

      if (session) {
        await session.abortTransaction();
      }

      if (!isTransactionNotSupported) {
        throw err;
      }

      // Fallback for local standalone MongoDB instances without transaction support.
      createdOrder = await createOrderFromCart();
    } finally {
      if (session) {
        session.endSession();
      }
    }

    res.status(201).json(createdOrder);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    const statusCode = message.includes("stock") || message.includes("Cart") || message.includes("products")
      ? 400
      : 500;
    res.status(statusCode).json({ message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    ADMIN: Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const pageSize = Math.max(1, Math.min(100, parseInt(limit) || 10));
    const skip = (pageNum - 1) * pageSize;

    const total = await Order.countDocuments({});
    const orders = await Order.find({})
      .populate("user", "id name email")
      .skip(skip)
      .limit(pageSize);
    const pages = Math.ceil(total / pageSize);

    res.json({
      data: orders,
      pagination: {
        total,
        page: pageNum,
        pages,
        limit: pageSize,
        hasNextPage: pageNum < pages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get order by id
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid order id" });
  }

  try {
    const order = await Order.findById(id).populate("user", "id name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!req.user.isAdmin && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid order id" });
  }

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!req.user.isAdmin && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this order" });
    }

    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
exports.updateOrderToDelivered = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid order id" });
  }

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
