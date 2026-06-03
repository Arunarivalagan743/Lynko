const {
  getAnalyticsSummary,
  getRecentVisits,
  getBrowserAnalytics,
  getDeviceAnalytics,
  getCountryAnalytics,
  getDailyTrends,
} = require("../services/analyticsService");

const getAnalyticsSummaryHandler = async (req, res, next) => {
  try {
    const ownerId = req.user?.id;
    const { id } = req.params;
    const { from, to } = req.query;

    const summary = await getAnalyticsSummary(ownerId, id, { from, to });

    return res.status(200).json({ summary });
  } catch (err) {
    return next(err);
  }
};

const getRecentVisitsHandler = async (req, res, next) => {
  try {
    const ownerId = req.user?.id;
    const { id } = req.params;
    const { from, to, limit, page } = req.query;

    const visits = await getRecentVisits(ownerId, id, {
      from,
      to,
      limit,
      page,
    });

    return res.status(200).json({ visits });
  } catch (err) {
    return next(err);
  }
};

const getBrowserAnalyticsHandler = async (req, res, next) => {
  try {
    const ownerId = req.user?.id;
    const { id } = req.params;
    const { from, to } = req.query;

    const browsers = await getBrowserAnalytics(ownerId, id, { from, to });

    return res.status(200).json({ browsers });
  } catch (err) {
    return next(err);
  }
};

const getDeviceAnalyticsHandler = async (req, res, next) => {
  try {
    const ownerId = req.user?.id;
    const { id } = req.params;
    const { from, to } = req.query;

    const devices = await getDeviceAnalytics(ownerId, id, { from, to });

    return res.status(200).json({ devices });
  } catch (err) {
    return next(err);
  }
};

const getCountryAnalyticsHandler = async (req, res, next) => {
  try {
    const ownerId = req.user?.id;
    const { id } = req.params;
    const { from, to } = req.query;

    const countries = await getCountryAnalytics(ownerId, id, { from, to });

    return res.status(200).json({ countries });
  } catch (err) {
    return next(err);
  }
};

const getDailyTrendsHandler = async (req, res, next) => {
  try {
    const ownerId = req.user?.id;
    const { id } = req.params;
    const { from, to } = req.query;

    const trends = await getDailyTrends(ownerId, id, { from, to });

    return res.status(200).json({ trends });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getAnalyticsSummary: getAnalyticsSummaryHandler,
  getRecentVisits: getRecentVisitsHandler,
  getBrowserAnalytics: getBrowserAnalyticsHandler,
  getDeviceAnalytics: getDeviceAnalyticsHandler,
  getCountryAnalytics: getCountryAnalyticsHandler,
  getDailyTrends: getDailyTrendsHandler,
};
