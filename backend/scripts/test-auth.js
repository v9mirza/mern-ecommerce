const {
  logStep,
  request,
  assertOk,
  assertTrue,
  ensureUser,
  defaultUser,
  defaultAdmin,
  makeAdminByEmail,
} = require("./utils");

async function run() {
  logStep("Auth flow: ensure normal user and login");
  const userAuth = await ensureUser(defaultUser);
  assertTrue(userAuth.user?.email === defaultUser.email.toLowerCase(), "User email mismatch");

  logStep("Auth flow: GET /api/users/me for normal user");
  const meRes = await request("/api/users/me", { token: userAuth.token });
  assertOk(meRes, "GET /api/users/me");
  assertTrue(meRes.data?.email === defaultUser.email.toLowerCase(), "GET /me returned wrong user");

  logStep("Auth flow: ensure admin user and promote");
  await ensureUser(defaultAdmin);
  await makeAdminByEmail(defaultAdmin.email);

  logStep("Auth flow: login as admin");
  const adminLogin = await request("/api/auth/login", {
    method: "POST",
    body: { email: defaultAdmin.email, password: defaultAdmin.password },
  });
  assertOk(adminLogin, "POST /api/auth/login (admin)");
  assertTrue(adminLogin.data?.token, "Admin token missing");

  const adminMe = await request("/api/users/me", { token: adminLogin.data.token });
  assertOk(adminMe, "GET /api/users/me (admin)");
  assertTrue(adminMe.data?.isAdmin === true, "Admin user is not marked as isAdmin=true");

  console.log("PASS: Auth flow works (user + admin)");
}

run().catch((err) => {
  console.error("FAIL:", err.message);
  process.exit(1);
});
