const express = require("express");
const { authenticate } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validate");
const { getProfile, updateProfile, deleteAccount } = require("../controllers/userController");
const { updateProfileSchema } = require("../validators/userValidators");

const router = express.Router();

router.get("/me", authenticate, getProfile);
router.patch("/me", authenticate, validate(updateProfileSchema), updateProfile);
router.delete("/me", authenticate, deleteAccount);

module.exports = { userRoutes: router };
