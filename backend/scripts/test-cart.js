const {
  logStep,
  request,
  assertOk,
  assertTrue,
  ensureUser,
  defaultUser,
  ensureAnyProductId,
} = require("./utils");

async function run() {
  // ─── Setup ────────────────────────────────────────────────────────────────
  logStep("Cart flow: setup user");
  const userAuth = await ensureUser(defaultUser);
  const token = userAuth.token;

  const productId = await ensureAnyProductId();

  // ─── Validation checks ────────────────────────────────────────────────────
  logStep("Validation: POST /api/cart with missing productId should fail");
  const missingProductRes = await request("/api/cart", {
    method: "POST",
    token,
    body: { qty: 1 },
  });
  assertTrue(
    missingProductRes.status === 400,
    `Expected 400 for missing productId, got ${missingProductRes.status}`
  );
  assertTrue(
    Array.isArray(missingProductRes.data?.errors),
    "Expected errors array in response"
  );

  logStep("Validation: POST /api/cart with invalid qty should fail");
  const badQtyRes = await request("/api/cart", {
    method: "POST",
    token,
    body: { productId, qty: -5 },
  });
  assertTrue(
    badQtyRes.status === 400,
    `Expected 400 for negative qty, got ${badQtyRes.status}`
  );

  logStep("Validation: POST /api/users with bad email should fail");
  const badEmailRes = await request("/api/users", {
    method: "POST",
    body: { name: "Test", email: "not-an-email", password: "pass123" },
  });
  assertTrue(
    badEmailRes.status === 400,
    `Expected 400 for invalid email, got ${badEmailRes.status}`
  );

  logStep("Validation: POST /api/users with short password should fail");
  const shortPassRes = await request("/api/users", {
    method: "POST",
    body: { name: "Test", email: "test@test.com", password: "abc" },
  });
  assertTrue(
    shortPassRes.status === 400,
    `Expected 400 for short password, got ${shortPassRes.status}`
  );

  // ─── Cart CRUD ────────────────────────────────────────────────────────────
  logStep("Cart flow: get empty cart");
  const emptyCartRes = await request("/api/cart", { token });
  assertOk(emptyCartRes, "GET /api/cart");
  assertTrue(
    Array.isArray(emptyCartRes.data?.items),
    "Cart items must be an array"
  );

  logStep("Cart flow: add item to cart");
  const addRes = await request("/api/cart", {
    method: "POST",
    token,
    body: { productId, qty: 1 },
  });
  assertOk(addRes, "POST /api/cart");
  assertTrue(
    addRes.data?.items?.length === 1,
    "Cart should have 1 item after adding"
  );
  assertTrue(
    addRes.data.items[0].product === productId,
    "Added product ID mismatch"
  );

  logStep("Cart flow: add same item again — qty should increment");
  const addAgainRes = await request("/api/cart", {
    method: "POST",
    token,
    body: { productId, qty: 1 },
  });
  assertOk(addAgainRes, "POST /api/cart (duplicate)");
  assertTrue(
    addAgainRes.data?.items?.length === 1,
    "Cart should still have 1 unique item"
  );
  assertTrue(
    addAgainRes.data.items[0].qty === 2,
    `Expected qty=2 after duplicate add, got ${addAgainRes.data.items[0].qty}`
  );

  logStep("Cart flow: update item quantity");
  const updateRes = await request(`/api/cart/${productId}`, {
    method: "PUT",
    token,
    body: { qty: 5 },
  });
  assertOk(updateRes, "PUT /api/cart/:productId");
  assertTrue(
    updateRes.data?.items?.[0]?.qty === 5,
    `Expected qty=5, got ${updateRes.data?.items?.[0]?.qty}`
  );

  logStep("Cart flow: remove item from cart");
  const removeRes = await request(`/api/cart/${productId}`, {
    method: "DELETE",
    token,
  });
  assertOk(removeRes, "DELETE /api/cart/:productId");
  assertTrue(
    removeRes.data?.items?.length === 0,
    "Cart should be empty after removing item"
  );

  logStep("Cart flow: add item then clear entire cart");
  await request("/api/cart", {
    method: "POST",
    token,
    body: { productId, qty: 2 },
  });
  const clearRes = await request("/api/cart", {
    method: "DELETE",
    token,
  });
  assertOk(clearRes, "DELETE /api/cart (clear)");
  assertTrue(
    clearRes.data?.message === "Cart cleared",
    "Expected 'Cart cleared' message"
  );

  console.log(
    "\nPASS: Cart flow works (add/increment/update/remove/clear) + validation guards confirmed"
  );
}

run().catch((err) => {
  console.error("FAIL:", err.message);
  process.exit(1);
});
