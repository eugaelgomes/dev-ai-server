require("dotenv").config();

const app = require("./app");
const { startCleanupJob } = require("./jobs/cleanup-job");
const { inject } = require("@vercel/analytics");

const port = Number(process.env.APP_PORT) || 8080;

try {
  if (isNaN(port)) throw new Error("Invalid port");

  inject();
  app.listen(port, "0.0.0.0", () =>
    console.log(`Server running on port ${port}`)
  );

  startCleanupJob();
} catch (error) {
  console.error("Failed to start application:", error);
  process.exit(1);
}
