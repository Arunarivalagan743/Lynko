const http = require("http");
const { app } = require("./app");
const { connectDb } = require("./config/db");
const { env } = require("./config/env");
const { initSocket } = require("./utils/socket");

const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

const start = async () => {
  await connectDb();

  server.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

const shutdown = (signal) => {
  console.log(`Received ${signal}. Shutting down...`);
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

start().catch((err) => {
  console.error("Startup error:", err);
  process.exit(1);
});
