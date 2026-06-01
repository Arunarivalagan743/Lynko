const express = require("express");
const {
	register,
	login,
	refresh,
	logout,
	logoutAll,
	forgotPassword,
	resetPasswordHandler,
} = require("../controllers/authController");
const {
	registerSchema,
	loginSchema,
	refreshSchema,
	logoutSchema,
	forgotPasswordSchema,
	resetPasswordSchema,
} = require("../validators/authValidators");
const { validate } = require("../middleware/validate");
const { authLimiter, passwordResetLimiter } = require("../middleware/rateLimit");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/refresh", validate(refreshSchema), refresh);
router.post("/logout", validate(logoutSchema), logout);
router.post("/logout-all", authenticate, logoutAll);
router.post(
	"/forgot-password",
	passwordResetLimiter,
	validate(forgotPasswordSchema),
	forgotPassword
);
router.post(
	"/reset-password",
	passwordResetLimiter,
	validate(resetPasswordSchema),
	resetPasswordHandler
);

module.exports = { authRoutes: router };
