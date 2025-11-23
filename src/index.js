require("dotenv").config();

const app = require("./app");

const port = Number(process.env.APP_PORT) || 8080;

try {
  if (isNaN(port)) {
    throw new Error("Invalid port");
  }

  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });

  // Tratamento de erros do servidor
  server.on("error", (error) => {
    console.error("Server error:", error);
    process.exit(1);
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close(() => {
      console.log("HTTP server closed");
      process.exit(0);
    });
  });

  process.on("SIGINT", () => {
    console.log("SIGINT signal received: closing HTTP server");
    server.close(() => {
      console.log("HTTP server closed");
      process.exit(0);
    });
  });
} catch (error) {
  console.error("Failed to start application:", error);
  process.exit(1);
}
