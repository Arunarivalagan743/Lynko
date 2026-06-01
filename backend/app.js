const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { registerRoutes } = require("./routes");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

registerRoutes(app);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

module.exports = { app };
