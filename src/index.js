require("dotenv").config();

const port = process.env.APP_PORT ? Number(process.env.APP_PORT) : 8080;

const app = require("./app");
const { startCleanupJob } = require("./jobs/cleanup-job");
const { inject } = require("@vercel/analytics");

try {
  if (!port || isNaN(port)) {
    process.exit(1);
  }
  
  // Injeta o Vercel Analytics
  inject();
  
  app.listen(port, "0.0.0.0", () => {});
  console.log(`Server is running on port ${port}`);
  
  // Inicia o job de limpeza automática
  startCleanupJob();
} catch (error) {
  console.error("Error starting the application:", error);
  process.exit(1);
}
