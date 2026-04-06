const {
  logStep,
  request,
  assertOk,
  assertTrue,
  ensureUser,
  defaultAdmin,
  makeAdminByEmail,
} = require("./utils");

function uniqueProduct() {
  const now = Date.now();
  return {
    name: `Test Product ${now}`,
    description: "MVP test product",
    price: 999,
    image: "https://via.placeholder.com/300",
    countInStock: 7,
  };
}

async function run() {
  logStep("Products flow: admin setup");
  await ensureUser(defaultAdmin);
  await makeAdminByEmail(defaultAdmin.email);
  const adminLogin = await request("/api/auth/login", {
    method: "POST",
    body: { email: defaultAdmin.email, password: defaultAdmin.password },
  });
  assertOk(adminLogin, "Admin login");
  const adminToken = adminLogin.data.token;

  logStep("Products flow: GET /api/products");
  const listRes = await request("/api/products");
  assertOk(listRes, "GET /api/products");
  assertTrue(Array.isArray(listRes.data), "Products list must be an array");

  logStep("Products flow: create product as admin");
  const createBody = uniqueProduct();
  const createRes = await request("/api/products", {
    method: "POST",
    token: adminToken,
    body: createBody,
  });
  assertOk(createRes, "POST /api/products");
  const productId = createRes.data?._id;
  assertTrue(Boolean(productId), "Created product id missing");

  logStep("Products flow: GET /api/products/:id");
  const getByIdRes = await request(`/api/products/${productId}`);
  assertOk(getByIdRes, "GET /api/products/:id");
  assertTrue(getByIdRes.data?._id === productId, "Fetched product id mismatch");

  logStep("Products flow: update product as admin");
  const updateRes = await request(`/api/products/${productId}`, {
    method: "PUT",
    token: adminToken,
    body: {
      ...createBody,
      name: `${createBody.name} Updated`,
      countInStock: 10,
    },
  });
  assertOk(updateRes, "PUT /api/products/:id");
  assertTrue(updateRes.data?.name.includes("Updated"), "Product update did not persist");

  logStep("Products flow: delete product as admin");
  const deleteRes = await request(`/api/products/${productId}`, {
    method: "DELETE",
    token: adminToken,
  });
  assertOk(deleteRes, "DELETE /api/products/:id");

  console.log("PASS: Product flow works (list/get/create/update/delete)");
}

run().catch((err) => {
  console.error("FAIL:", err.message);
  process.exit(1);
});
