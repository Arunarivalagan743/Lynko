"use strict";

const {
  getTopLinks,
  getReferrerAnalytics,
  getGeographyAnalytics,
  getRecentActivity,
  getTrafficQuality,
  getSmartInsights,
  getPlatformAnalytics,
} = require("../services/analyticsEngagementService");

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE 1 – Top Performing Links
// GET /api/analytics/top-links
// ─────────────────────────────────────────────────────────────────────────────
const getTopLinksHandler = async (req, res, next) => {
  try {
    const ownerId = req.user?.id;
    const topLinks = await getTopLinks(ownerId);
    return res.status(200).json({ topLinks });
  } catch (err) {
    return next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE 2 – Referrer Analytics
// GET /api/analytics/referrers/:urlId
// ─────────────────────────────────────────────────────────────────────────────
const getReferrerAnalyticsHandler = async (req, res, next) => {
  try {
    const ownerId = req.user?.id;
    const { urlId } = req.params;
    const referrers = await getReferrerAnalytics(ownerId, urlId);
    return res.status(200).json({ referrers });
  } catch (err) {
    return next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE 3 – Geographic Analytics
// GET /api/analytics/geography/:urlId
// ─────────────────────────────────────────────────────────────────────────────
const getGeographyAnalyticsHandler = async (req, res, next) => {
  try {
    const ownerId = req.user?.id;
    const { urlId } = req.params;
    const countries = await getGeographyAnalytics(ownerId, urlId);
    return res.status(200).json({ countries });
  } catch (err) {
    return next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE 4 – Recent Activity Feed
// GET /api/analytics/recent-activity
// ─────────────────────────────────────────────────────────────────────────────
const getRecentActivityHandler = async (req, res, next) => {
  try {
    const ownerId = req.user?.id;
    const activities = await getRecentActivity(ownerId);
    return res.status(200).json({ activities });
  } catch (err) {
    return next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE 5 – Traffic Quality Breakdown
// GET /api/analytics/traffic-quality
// ─────────────────────────────────────────────────────────────────────────────
const getTrafficQualityHandler = async (req, res, next) => {
  try {
    const ownerId = req.user?.id;
    const quality = await getTrafficQuality(ownerId);
    return res.status(200).json(quality);
  } catch (err) {
    return next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE 6 – Smart Insights
// GET /api/analytics/insights/:urlId
// ─────────────────────────────────────────────────────────────────────────────
const getSmartInsightsHandler = async (req, res, next) => {
  try {
    const ownerId = req.user?.id;
    const { urlId } = req.params;
    const insights = await getSmartInsights(ownerId, urlId);
    return res.status(200).json({ insights });
  } catch (err) {
    return next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// NEW FEATURE – Platform-Specific Tracking Links Analytics
// GET /api/analytics/platforms/:urlId
// ─────────────────────────────────────────────────────────────────────────────
const getPlatformAnalyticsHandler = async (req, res, next) => {
  try {
    const ownerId = req.user?.id;
    const { urlId } = req.params;
    const platforms = await getPlatformAnalytics(ownerId, urlId);
    return res.status(200).json({ platforms });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getTopLinks: getTopLinksHandler,
  getReferrerAnalytics: getReferrerAnalyticsHandler,
  getGeographyAnalytics: getGeographyAnalyticsHandler,
  getRecentActivity: getRecentActivityHandler,
  getTrafficQuality: getTrafficQualityHandler,
  getSmartInsights: getSmartInsightsHandler,
  getPlatformAnalytics: getPlatformAnalyticsHandler,
};
