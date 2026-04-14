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
  logStep("Wishlist flow: setup user");
  const userAuth = await ensureUser(defaultUser);
  const token = userAuth.token;

  const productId = await ensureAnyProductId();

  // ─── Validation checks ────────────────────────────────────────────────────
  logStep("Validation: POST /api/wishlist/toggle with missing productId should fail");
  const missingProductRes = await request("/api/wishlist/toggle", {
    method: "POST",
    token,
    body: {},
  });
  assertTrue(
    missingProductRes.status === 400,
    `Expected 400 for missing productId, got ${missingProductRes.status}`
  );

  // ─── Wishlist CRUD ────────────────────────────────────────────────────────
  logStep("Wishlist flow: get empty wishlist");
  const emptyWishlistRes = await request("/api/wishlist", { token });
  assertOk(emptyWishlistRes, "GET /api/wishlist");
  assertTrue(
    Array.isArray(emptyWishlistRes.data?.products),
    "Wishlist products must be an array"
  );

  logStep("Wishlist flow: toggle product (ADD)");
  const addRes = await request("/api/wishlist/toggle", {
    method: "POST",
    token,
    body: { productId },
  });
  assertOk(addRes, "POST /api/wishlist/toggle (ADD)");
  assertTrue(
    addRes.data?.message === "Product added to wishlist",
    "Expected add message"
  );
  assertTrue(
    addRes.data?.wishlist?.products?.length === 1,
    "Wishlist should have 1 item"
  );
  assertTrue(
    addRes.data.wishlist.products[0]._id === productId,
    "Added product ID mismatch (populated)"
  );

  logStep("Wishlist flow: get populated wishlist");
  const getWishlistRes = await request("/api/wishlist", { token });
  assertOk(getWishlistRes, "GET /api/wishlist (populated)");
  assertTrue(
    getWishlistRes.data?.products?.[0]?.name !== undefined,
    "Product should be populated with details like name"
  );

  logStep("Wishlist flow: toggle same product (REMOVE)");
  const removeRes = await request("/api/wishlist/toggle", {
    method: "POST",
    token,
    body: { productId },
  });
  assertOk(removeRes, "POST /api/wishlist/toggle (REMOVE)");
  assertTrue(
    removeRes.data?.message === "Product removed from wishlist",
    "Expected remove message"
  );
  assertTrue(
    removeRes.data?.wishlist?.products?.length === 0,
    "Wishlist should now be empty"
  );

  logStep("Wishlist flow: add item then clear entire wishlist");
  await request("/api/wishlist/toggle", {
    method: "POST",
    token,
    body: { productId },
  });
  const clearRes = await request("/api/wishlist", {
    method: "DELETE",
    token,
  });
  assertOk(clearRes, "DELETE /api/wishlist (clear)");
  assertTrue(
    clearRes.data?.message === "Wishlist cleared",
    "Expected 'Wishlist cleared' message"
  );

  console.log(
    "\nPASS: Wishlist flow works (toggle add/remove + clear) and populates properly!"
  );
}

run().catch((err) => {
  console.error("FAIL:", err.message);
  process.exit(1);
});
