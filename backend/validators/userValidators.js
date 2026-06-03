const { z } = require("zod");

const phoneRegex = /^\+?[0-9]{7,15}$/;

const updateProfileSchema = z
  .object({
    email: z.string().email().toLowerCase().optional(),
    name: z.string().trim().min(2).max(60).optional(),
    phone: z.string().trim().regex(phoneRegex, "Invalid phone number").optional(),
  })
  .refine((value) => value.email || value.name || value.phone, {
    message: "At least one field must be provided",
  });

module.exports = {
  updateProfileSchema,
};
