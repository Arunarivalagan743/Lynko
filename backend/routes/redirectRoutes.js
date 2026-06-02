const express = require("express");
const { redirect } = require("../controllers/redirectController");
const { redirectLimiter } = require("../middleware/rateLimit");

const router = express.Router();

router.get("/r/:shortCode", redirectLimiter, redirect);

module.exports = { redirectRoutes: router };
