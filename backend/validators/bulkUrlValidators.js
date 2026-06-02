const { z } = require("zod");

const MAX_ROWS = 500;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const SHORT_CODE_REGEX = /^[a-zA-Z0-9_-]{4,32}$/;

const optionalAlias = z.preprocess(
  (value) => {
    if (typeof value === "string" && value.trim() === "") {
      return undefined;
    }
    return value;
  },
  z.string().regex(SHORT_CODE_REGEX).optional()
);

const rowSchema = z.object({
  originalUrl: z.string().url().max(2048),
  customAlias: optionalAlias,
});

const bulkUrlSchema = z.object({
  fileSizeBytes: z.coerce.number().int().min(1).max(MAX_FILE_SIZE),
  rows: z.array(rowSchema).min(1).max(MAX_ROWS),
});

module.exports = {
  bulkUrlSchema,
};
