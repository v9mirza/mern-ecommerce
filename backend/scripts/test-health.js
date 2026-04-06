const { BASE_URL, logStep, request, assertOk, assertTrue } = require("./utils");

async function run() {
  logStep(`Health check on ${BASE_URL}`);
  const healthRes = await request("/api/health");
  assertOk(healthRes, "GET /api/health");
  assertTrue(healthRes.data?.status === "ok", "Health status must be 'ok'");
  console.log("PASS: Health endpoint is working");
}

run().catch((err) => {
  console.error("FAIL:", err.message);
  process.exit(1);
});
