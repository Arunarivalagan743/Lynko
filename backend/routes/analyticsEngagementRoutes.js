"use strict";

const express = require("express");
const {
  getTopLinks,
  getReferrerAnalytics,
  getGeographyAnalytics,
  getRecentActivity,
  getTrafficQuality,
  getSmartInsights,
  getPlatformAnalytics,
} = require("../controllers/analyticsEngagementController");
const { authenticate } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validate");
const {
  referrersParamSchema,
  geographyParamSchema,
  insightsParamSchema,
  platformsParamSchema,
} = require("../validators/analyticsEngagementValidators");

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// All routes require a valid JWT (authenticate).
// Routes that take a :urlId param additionally validate the param via Zod.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * FEATURE 1 – Top Performing Links
 * Returns the calling user's 10 links with the highest click counts.
 *
 * GET /api/analytics/top-links
 * Auth: Bearer token required
 */
router.get("/top-links", authenticate, getTopLinks);

/**
 * FEATURE 2 – Referrer Analytics
 * Returns normalised traffic-source breakdown for a specific link.
 *
 * GET /api/analytics/referrers/:urlId
 * Auth: Bearer token required
 * Param: urlId – 24-char MongoDB ObjectId
 */
router.get(
  "/referrers/:urlId",
  authenticate,
  validate(referrersParamSchema, "params"),
  getReferrerAnalytics
);

/**
 * FEATURE 3 – Geographic Analytics
 * Returns country-level click distribution for a specific link.
 *
 * GET /api/analytics/geography/:urlId
 * Auth: Bearer token required
 * Param: urlId – 24-char MongoDB ObjectId
 */
router.get(
  "/geography/:urlId",
  authenticate,
  validate(geographyParamSchema, "params"),
  getGeographyAnalytics
);

/**
 * FEATURE 4 – Recent Activity Feed
 * Returns the latest 20 visits across all of the calling user's links.
 *
 * GET /api/analytics/recent-activity
 * Auth: Bearer token required
 */
router.get("/recent-activity", authenticate, getRecentActivity);

/**
 * FEATURE 5 – Traffic Quality Breakdown
 * Returns human / bot / suspicious counts and percentages for all user links.
 *
 * GET /api/analytics/traffic-quality
 * Auth: Bearer token required
 */
router.get("/traffic-quality", authenticate, getTrafficQuality);

/**
 * FEATURE 6 – Smart Insights
 * Returns 1-4 deterministic plain-English insights for a specific link.
 *
 * GET /api/analytics/insights/:urlId
 * Auth: Bearer token required
 * Param: urlId – 24-char MongoDB ObjectId
 */
router.get(
  "/insights/:urlId",
  authenticate,
  validate(insightsParamSchema, "params"),
  getSmartInsights
);

/**
 * FEATURE 7 – Platform-Specific Tracking Links Analytics
 * Returns platform click counts for a specific link.
 *
 * GET /api/analytics/platforms/:urlId
 * Auth: Bearer token required
 * Param: urlId – 24-char MongoDB ObjectId
 */
router.get(
  "/platforms/:urlId",
  authenticate,
  validate(platformsParamSchema, "params"),
  getPlatformAnalytics
);

module.exports = { analyticsEngagementRoutes: router };
