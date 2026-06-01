const express = require("express");
const { authenticate } = require("../middleware/authMiddleware");
const { getProfile } = require("../controllers/userController");

const router = express.Router();

router.get("/me", authenticate, getProfile);

module.exports = { userRoutes: router };
