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

  logStep("Orders flow: create order as user");
  const orderPayload = {
    orderItems: [
      {
        name: "Test Order Item",
        qty: 1,
        image: "https://via.placeholder.com/300",
        price: 299,
        product: productId,
      },
    ],
    shippingAddress: {
      address: "123 MVP Street",
      city: "Mumbai",
      postalCode: "400001",
      country: "India",
    },
    paymentMethod: "Cash On Delivery",
    itemsPrice: 299,
    taxPrice: 0,
    shippingPrice: 100,
    totalPrice: 399,
  };

  const createOrderRes = await request("/api/orders", {
    method: "POST",
    token: userAuth.token,
    body: orderPayload,
  });
  assertOk(createOrderRes, "POST /api/orders");
  const orderId = createOrderRes.data?._id;
  assertTrue(Boolean(orderId), "Created order id missing");

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
  assertTrue(Array.isArray(allOrdersRes.data), "All orders must be an array");

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
