const express = require("express");
const { getStats } = require("../controllers/statsController");

const router = express.Router();

router.get("/stats/:shortCode", getStats);

module.exports = { statsRoutes: router };
