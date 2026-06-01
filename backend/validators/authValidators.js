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

module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema,
  logoutSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
