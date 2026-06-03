const { z } = require("zod");

const updateProfileSchema = z
  .object({
    email: z.string().email().toLowerCase().optional(),
  })
  .refine((value) => value.email, {
    message: "Email must be provided",
  });

module.exports = {
  updateProfileSchema,
};
