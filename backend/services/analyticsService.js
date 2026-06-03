const { Url } = require("../model/Url");
const { Visit } = require("../model/Visit");
const { AppError } = require("../utils/AppError");

const MAX_RECENT_LIMIT = 100;

const toDate = (value, label) => {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new AppError(`Invalid ${label} date`, 400);
  }

  return date;
};

const buildTimestampMatch = (options = {}) => {
  const fromDate = toDate(options.from, "from");
  const toDateValue = toDate(options.to, "to");

  if (!fromDate && !toDateValue) {
    return {};
  }

  const match = {};
  if (fromDate) {
    match.$gte = fromDate;
  }
  if (toDateValue) {
    match.$lte = toDateValue;
  }

  return { timestamp: match };
};

const assertUrlAccess = async (ownerId, urlId) => {
  if (!ownerId) {
    throw new AppError("Unauthorized", 401);
  }
  if (!urlId) {
    throw new AppError("URL id is required", 400);
  }

  const url = await Url.findOne({ _id: urlId, ownerId }).lean();
  if (!url) {
    throw new AppError("URL not found", 404);
  }

  return url;
};

const getAnalyticsSummary = async (ownerId, urlId, options = {}) => {
  const url = await assertUrlAccess(ownerId, urlId);
  const match = { urlId: url._id, ...buildTimestampMatch(options) };

  const summary = await Visit.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        lastVisit: { $max: "$timestamp" },
        uniqueBrowsers: { $addToSet: "$browser" },
        uniqueDevices: { $addToSet: "$device" },
        visitCount: { $sum: 1 },
        humanClicks: {
          $sum: { $cond: [{ $eq: ["$clickQuality", "human"] }, 1, 0] },
        },
        botClicks: {
          $sum: { $cond: [{ $eq: ["$clickQuality", "bot"] }, 1, 0] },
        },
        suspiciousClicks: {
          $sum: { $cond: [{ $eq: ["$clickQuality", "suspicious"] }, 1, 0] },
        },
      },
    },
  ]);

  const hasRange = Boolean(options.from || options.to);
  const base = summary[0] || {
    lastVisit: null,
    uniqueBrowsers: [],
    uniqueDevices: [],
    visitCount: 0,
    humanClicks: 0,
    botClicks: 0,
    suspiciousClicks: 0,
  };

  return {
    totalClicks: hasRange ? base.visitCount : url.clickCount || 0,
    lastVisit: base.lastVisit,
    uniqueBrowsers: base.uniqueBrowsers.length,
    uniqueDevices: base.uniqueDevices.length,
    humanClicks: base.humanClicks,
    botClicks: base.botClicks,
    suspiciousClicks: base.suspiciousClicks,
  };
};

const getRecentVisits = async (ownerId, urlId, options = {}) => {
  const url = await assertUrlAccess(ownerId, urlId);
  const match = { urlId: url._id, ...buildTimestampMatch(options) };

  const limit = Math.min(
    Math.max(Number(options.limit) || 20, 1),
    MAX_RECENT_LIMIT
  );
  const page = Math.max(Number(options.page) || 1, 1);
  const skip = (page - 1) * limit;

  return Visit.find(match)
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)
    .select("timestamp browser device country city region referrer clickQuality ipAddress latitude longitude")
    .lean();
};

const getBrowserAnalytics = async (ownerId, urlId, options = {}) => {
  const url = await assertUrlAccess(ownerId, urlId);
  const match = { urlId: url._id, ...buildTimestampMatch(options) };

  const rows = await Visit.aggregate([
    { $match: match },
    { $group: { _id: "$browser", count: { $sum: 1 } } },
  ]);

  const result = {
    chrome: 0,
    firefox: 0,
    safari: 0,
    edge: 0,
  };

  for (const row of rows) {
    const key = String(row._id || "").toLowerCase();
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      result[key] = row.count;
    }
  }

  return result;
};

const getDeviceAnalytics = async (ownerId, urlId, options = {}) => {
  const url = await assertUrlAccess(ownerId, urlId);
  const match = { urlId: url._id, ...buildTimestampMatch(options) };

  const rows = await Visit.aggregate([
    { $match: match },
    { $group: { _id: "$device", count: { $sum: 1 } } },
  ]);

  const result = {
    mobile: 0,
    desktop: 0,
    tablet: 0,
  };

  for (const row of rows) {
    const key = String(row._id || "").toLowerCase();
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      result[key] = row.count;
    }
  }

  return result;
};

const getCountryAnalytics = async (ownerId, urlId, options = {}) => {
  const url = await assertUrlAccess(ownerId, urlId);
  const match = { urlId: url._id, ...buildTimestampMatch(options) };

  const rows = await Visit.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $ifNull: ["$country", "Unknown"] },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  return rows.map((row) => ({
    country: row._id || "Unknown",
    count: row.count,
  }));
};

const getDailyTrends = async (ownerId, urlId, options = {}) => {
  const url = await assertUrlAccess(ownerId, urlId);
  const match = { urlId: url._id, ...buildTimestampMatch(options) };

  const rows = await Visit.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return rows.map((row) => ({
    date: row._id,
    count: row.count,
  }));
};



module.exports = {
  getAnalyticsSummary,
  getRecentVisits,
  getBrowserAnalytics,
  getDeviceAnalytics,
  getCountryAnalytics,
  getDailyTrends,
};
