const { authRoutes } = require("./authRoutes");
const { userRoutes } = require("./userRoutes");
const { urlRoutes } = require("./urlRoutes");
const { analyticsRoutes } = require("./analyticsRoutes");
const { redirectRoutes } = require("./redirectRoutes");
const { statsRoutes } = require("./statsRoutes");
const { bulkUrlRoutes } = require("./bulkUrlRoutes");

const registerRoutes = (app) => {
  app.use(redirectRoutes);
  app.use(statsRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/urls", urlRoutes);
  app.use("/api/urls", bulkUrlRoutes);
  app.use("/api/urls", analyticsRoutes);
};

module.exports = { registerRoutes };
