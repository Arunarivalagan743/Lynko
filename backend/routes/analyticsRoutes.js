const express = require("express");
const {
  getAnalyticsSummary,
  getRecentVisits,
  getBrowserAnalytics,
  getDeviceAnalytics,
  getCountryAnalytics,
  getDailyTrends,
} = require("../controllers/analyticsController");
const { authenticate } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validate");
const {
  urlIdParamSchema,
  recentVisitsQuerySchema,
  trendsQuerySchema,
  analyticsSummaryQuerySchema,
} = require("../validators/analyticsValidators");

const router = express.Router();

router.get(
  "/:id/analytics",
  authenticate,
  validate(urlIdParamSchema, "params"),
  validate(analyticsSummaryQuerySchema, "query"),
  getAnalyticsSummary
);

router.get(
  "/:id/visits",
  authenticate,
  validate(urlIdParamSchema, "params"),
  validate(recentVisitsQuerySchema, "query"),
  getRecentVisits
);

router.get(
  "/:id/browsers",
  authenticate,
  validate(urlIdParamSchema, "params"),
  validate(analyticsSummaryQuerySchema, "query"),
  getBrowserAnalytics
);

router.get(
  "/:id/devices",
  authenticate,
  validate(urlIdParamSchema, "params"),
  validate(analyticsSummaryQuerySchema, "query"),
  getDeviceAnalytics
);

router.get(
  "/:id/countries",
  authenticate,
  validate(urlIdParamSchema, "params"),
  validate(analyticsSummaryQuerySchema, "query"),
  getCountryAnalytics
);

router.get(
  "/:id/trends",
  authenticate,
  validate(urlIdParamSchema, "params"),
  validate(trendsQuerySchema, "query"),
  getDailyTrends
);



module.exports = { analyticsRoutes: router };
