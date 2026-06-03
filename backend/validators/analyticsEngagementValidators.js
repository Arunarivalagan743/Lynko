"use strict";

const { z } = require("zod");

// ─────────────────────────────────────────────────────────────────────────────
// Shared primitive validators
// ─────────────────────────────────────────────────────────────────────────────

/** Validates a 24-character MongoDB ObjectId hex string. */
const objectIdRegex = /^[a-fA-F0-9]{24}$/;

const urlIdParamSchema = z.object({
  urlId: z
    .string({ required_error: "urlId param is required" })
    .regex(objectIdRegex, "urlId must be a valid 24-character MongoDB ObjectId"),
});

// ─────────────────────────────────────────────────────────────────────────────
// Per-route schemas
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/analytics/top-links
 * No params / body – auth only. Schema is a no-op placeholder kept here
 * so the route still goes through validate() for consistency.
 */
const topLinksQuerySchema = z.object({}).strict();

/**
 * GET /api/analytics/referrers/:urlId
 * Params only – validated via urlIdParamSchema.
 */
const referrersParamSchema = urlIdParamSchema;

/**
 * GET /api/analytics/geography/:urlId
 * Params only – validated via urlIdParamSchema.
 */
const geographyParamSchema = urlIdParamSchema;

/**
 * GET /api/analytics/recent-activity
 * No params / body – auth only.
 */
const recentActivityQuerySchema = z.object({}).strict();

/**
 * GET /api/analytics/traffic-quality
 * No params / body – auth only.
 */
const trafficQualityQuerySchema = z.object({}).strict();

/**
 * GET /api/analytics/insights/:urlId
 * Params only – validated via urlIdParamSchema.
 */
const insightsParamSchema = urlIdParamSchema;

/**
 * GET /api/analytics/platforms/:urlId
 * Params only – validated via urlIdParamSchema.
 */
const platformsParamSchema = urlIdParamSchema;

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────
module.exports = {
  urlIdParamSchema,
  topLinksQuerySchema,
  referrersParamSchema,
  geographyParamSchema,
  recentActivityQuerySchema,
  trafficQualityQuerySchema,
  insightsParamSchema,
  platformsParamSchema,
};
