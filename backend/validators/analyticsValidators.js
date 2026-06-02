const { z } = require("zod");

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

const urlIdParamSchema = z.object({
  id: z.string().regex(objectIdRegex, "Invalid URL id"),
});

const dateString = z
  .string()
  .refine((value) => !Number.isNaN(new Date(value).getTime()), {
    message: "Invalid date",
  });

const fromToSchema = z.object({
  from: dateString.optional(),
  to: dateString.optional(),
});

const recentVisitsQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    from: dateString.optional(),
    to: dateString.optional(),
  })
  .refine(
    (value) => !value.from || !value.to || new Date(value.from) <= new Date(value.to),
    { message: "from must be before to" }
  );

const trendsQuerySchema = fromToSchema.refine(
  (value) => !value.from || !value.to || new Date(value.from) <= new Date(value.to),
  { message: "from must be before to" }
);

const analyticsSummaryQuerySchema = fromToSchema.refine(
  (value) => !value.from || !value.to || new Date(value.from) <= new Date(value.to),
  { message: "from must be before to" }
);

module.exports = {
  urlIdParamSchema,
  recentVisitsQuerySchema,
  trendsQuerySchema,
  analyticsSummaryQuerySchema,
};
