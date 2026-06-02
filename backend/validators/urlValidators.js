const { z } = require("zod");

const SHORT_CODE_REGEX = /^[a-zA-Z0-9_-]{4,32}$/;

const createUrlSchema = z.object({
  originalUrl: z.string().url().max(2048),
  customAlias: z.string().regex(SHORT_CODE_REGEX).optional(),
  expiresAt: z.coerce.date().optional(),
});

const updateUrlSchema = z
  .object({
    originalUrl: z.string().url().max(2048).optional(),
    expiresAt: z.coerce.date().optional(),
  })
  .refine((value) => value.originalUrl || value.expiresAt, {
    message: "At least one field must be provided",
  });

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

const urlIdParamSchema = z.object({
  id: z.string().regex(objectIdRegex, "Invalid URL id"),
});

module.exports = {
  createUrlSchema,
  updateUrlSchema,
  urlIdParamSchema,
};
