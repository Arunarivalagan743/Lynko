const { z } = require("zod");

const registerSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(72),
});

const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(72),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(20),
});

const logoutSchema = refreshSchema;

const forgotPasswordSchema = z.object({
  email: z.string().email().toLowerCase(),
});

const resetPasswordSchema = z.object({
  token: z.string().min(20),
  password: z.string().min(8).max(72),
});

const refreshCookieSchema = z.object({
  refreshToken: z.string({
    required_error: "Refresh token is required",
  }).min(20),
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema,
  logoutSchema,
  refreshCookieSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
