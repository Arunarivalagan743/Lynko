const { z } = require("zod");

const SHORT_CODE_REGEX = /^[a-zA-Z0-9_-]{4,32}$/;

const createUrlSchema = z.object({
  originalUrl: z.string().url().max(2048),
  customAlias: z.string().regex(SHORT_CODE_REGEX).optional(),
  expiresAt: z.coerce.date().optional(),
});

const urlIdParamSchema = z.object({
  id: z.string().min(1),
});

module.exports = {
  createUrlSchema,
  urlIdParamSchema,
};
