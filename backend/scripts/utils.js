const BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";

const defaultUser = {
  name: process.env.TEST_USER_NAME || "MVP Test User",
  email: process.env.TEST_USER_EMAIL || "devcart.user@example.com",
  password: process.env.TEST_USER_PASSWORD || "password123",
};

const defaultAdmin = {
  name: process.env.TEST_ADMIN_NAME || "MVP Test Admin",
  email: process.env.TEST_ADMIN_EMAIL || "devcart.admin@example.com",
  password: process.env.TEST_ADMIN_PASSWORD || "adminpass123",
};

function logStep(message) {
  console.log(`\n=== ${message} ===`);
}

function toJsonSafe(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

async function request(path, { method = "GET", token, body } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const data = toJsonSafe(text);

  return {
    ok: res.ok,
    status: res.status,
    data,
  };
}

function assertOk(response, action) {
  if (!response.ok) {
    const pretty = JSON.stringify(response.data, null, 2);
    throw new Error(`${action} failed (${response.status}): ${pretty}`);
  }
}

function assertTrue(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function ensureUser(user) {
  await request("/api/users", { method: "POST", body: user });
  const loginRes = await request("/api/auth/login", {
    method: "POST",
    body: { email: user.email, password: user.password },
  });
  assertOk(loginRes, `Login for ${user.email}`);
  assertTrue(loginRes.data?.token, `Token missing for ${user.email}`);
  return loginRes.data;
}

async function makeAdminByEmail(email) {
  const mongoose = require("mongoose");
  const dotenv = require("dotenv");
  const User = require("../models/User");

  dotenv.config();

  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    await mongoose.disconnect();
    throw new Error(`Admin promotion failed. User not found: ${email}`);
  }

  if (!user.isAdmin) {
    user.isAdmin = true;
    await user.save();
  }

  await mongoose.disconnect();
}

async function ensureAnyProductId() {
  const productsRes = await request("/api/products");
  assertOk(productsRes, "GET /api/products");

  if (Array.isArray(productsRes.data) && productsRes.data.length > 0) {
    return productsRes.data[0]._id;
  }

  const adminAuth = await ensureUser(defaultAdmin);
  await makeAdminByEmail(defaultAdmin.email);

  const createBody = {
    name: `Auto Seed Product ${Date.now()}`,
    description: "Auto-created for test prerequisites",
    price: 999,
    image: "https://via.placeholder.com/300",
    category: "Testing",
    countInStock: 10,
  };

  const createRes = await request("/api/products", {
    method: "POST",
    token: adminAuth.token,
    body: createBody,
  });

  assertOk(createRes, "POST /api/products (auto-seed)");
  assertTrue(Boolean(createRes.data?._id), "Auto-seeded product id missing");
  return createRes.data._id;
}

module.exports = {
  BASE_URL,
  defaultUser,
  defaultAdmin,
  logStep,
  request,
  assertOk,
  assertTrue,
  ensureUser,
  makeAdminByEmail,
  ensureAnyProductId,
};
