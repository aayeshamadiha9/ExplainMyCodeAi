const { port, nodeEnv, geminiModel } = require("./config/env");
const app = require("./app");

const server = app.listen(port, () => {
  console.log("=".repeat(60));
  console.log(`🚀 Explain My Code AI Server listening on port ${port}`);
  console.log(`   Environment : ${nodeEnv}`);
  console.log(`   Model       : ${geminiModel}`);
  console.log(`   Health Check: http://localhost:${port}/api/health`);
  console.log(`   Metadata    : http://localhost:${port}/api/meta`);
  console.log("=".repeat(60));
});

// Graceful shutdown
const handleShutdown = (signal) => {
  console.log(`\nReceived ${signal}. Shutting down server gracefully...`);
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", () => handleShutdown("SIGINT"));
process.on("SIGTERM", () => handleShutdown("SIGTERM"));
