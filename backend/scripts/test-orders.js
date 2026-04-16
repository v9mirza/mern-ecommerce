const {
  logStep,
  request,
  assertOk,
  assertTrue,
  ensureUser,
  defaultUser,
  defaultAdmin,
  makeAdminByEmail,
  ensureAnyProductId,
} = require("./utils");

async function run() {
  logStep("Orders flow: setup user + admin");
  const userAuth = await ensureUser(defaultUser);
  await ensureUser(defaultAdmin);
  await makeAdminByEmail(defaultAdmin.email);

  const adminLogin = await request("/api/auth/login", {
    method: "POST",
    body: { email: defaultAdmin.email, password: defaultAdmin.password },
  });
  assertOk(adminLogin, "Admin login");
  const adminToken = adminLogin.data.token;

  const productId = await ensureAnyProductId();
  const productBeforeRes = await request(`/api/products/${productId}`);
  assertOk(productBeforeRes, "GET /api/products/:id (before order)");
  const stockBefore = productBeforeRes.data?.countInStock;
  assertTrue(typeof stockBefore === "number", "Product stock must be a number");

  logStep("Orders flow: clear cart to keep test deterministic");
  const clearCartRes = await request("/api/cart", {
    method: "DELETE",
    token: userAuth.token,
  });
  assertOk(clearCartRes, "DELETE /api/cart");

  logStep("Orders flow: add item to cart before checkout");
  const addToCartRes = await request("/api/cart", {
    method: "POST",
    token: userAuth.token,
    body: { productId, qty: 1 },
  });
  assertOk(addToCartRes, "POST /api/cart");

  logStep("Orders flow: create order as user");
  const orderPayload = {
    shippingAddress: {
      address: "123 MVP Street",
      city: "Mumbai",
      postalCode: "400001",
      country: "India",
    },
    paymentMethod: "Cash On Delivery",
    // These should be ignored by backend, which now computes prices server-side.
    itemsPrice: 1,
    taxPrice: 1,
    shippingPrice: 1,
    totalPrice: 1,
  };

  const createOrderRes = await request("/api/orders", {
    method: "POST",
    token: userAuth.token,
    body: orderPayload,
  });
  assertOk(createOrderRes, "POST /api/orders");
  const orderId = createOrderRes.data?._id;
  assertTrue(Boolean(orderId), "Created order id missing");
  assertTrue(createOrderRes.data?.orderItems?.length >= 1, "Order should be created from cart items");
  assertTrue(
    createOrderRes.data?.orderItems?.some((item) => item.product === productId && item.qty === 1),
    "Order must include the product added to cart"
  );
  assertTrue(createOrderRes.data?.itemsPrice > 1, "Order prices should be server-calculated");

  logStep("Orders flow: cart should be cleared after successful checkout");
  const cartAfterOrderRes = await request("/api/cart", { token: userAuth.token });
  assertOk(cartAfterOrderRes, "GET /api/cart");
  assertTrue(cartAfterOrderRes.data?.items?.length === 0, "Cart should be empty after placing order");

  logStep("Orders flow: stock should decrement after successful checkout");
  const productAfterRes = await request(`/api/products/${productId}`);
  assertOk(productAfterRes, "GET /api/products/:id (after order)");
  const stockAfter = productAfterRes.data?.countInStock;
  assertTrue(stockAfter === stockBefore - 1, `Stock must decrement by 1 (before=${stockBefore}, after=${stockAfter})`);

  logStep("Orders flow: get my orders");
  const myOrdersRes = await request("/api/orders/myorders", { token: userAuth.token });
  assertOk(myOrdersRes, "GET /api/orders/myorders");
  assertTrue(Array.isArray(myOrdersRes.data), "My orders must be an array");

  logStep("Orders flow: get order by id as owner");
  const getOrderRes = await request(`/api/orders/${orderId}`, { token: userAuth.token });
  assertOk(getOrderRes, "GET /api/orders/:id (owner)");
  assertTrue(getOrderRes.data?._id === orderId, "Order id mismatch");

  logStep("Orders flow: mark order as paid (owner)");
  const payRes = await request(`/api/orders/${orderId}/pay`, {
    method: "PUT",
    token: userAuth.token,
  });
  assertOk(payRes, "PUT /api/orders/:id/pay");
  assertTrue(payRes.data?.isPaid === true, "Order was not marked paid");

  logStep("Orders flow: admin can list all orders");
  const allOrdersRes = await request("/api/orders", { token: adminToken });
  assertOk(allOrdersRes, "GET /api/orders (admin)");
  assertTrue(Array.isArray(allOrdersRes.data?.data), "All orders must be an array");

  logStep("Orders flow: admin mark delivered");
  const deliverRes = await request(`/api/orders/${orderId}/deliver`, {
    method: "PUT",
    token: adminToken,
  });
  assertOk(deliverRes, "PUT /api/orders/:id/deliver");
  assertTrue(deliverRes.data?.isDelivered === true, "Order was not marked delivered");

  console.log("PASS: Order flow works (create/myorders/get/pay/admin list/deliver)");
}

run().catch((err) => {
  console.error("FAIL:", err.message);
  process.exit(1);
});
