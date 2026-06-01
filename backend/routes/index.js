const { authRoutes } = require("./authRoutes");
const { userRoutes } = require("./userRoutes");
const { urlRoutes } = require("./urlRoutes");

const registerRoutes = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/urls", urlRoutes);
};

module.exports = { registerRoutes };
