const { Url } = require("../model/Url");
const { Visit } = require("../model/Visit");
const { AppError } = require("../utils/AppError");

const getUrlByShortCode = async (shortCode) => {
  if (!shortCode) {
    throw new AppError("Short code is required", 400);
  }

  const url = await Url.findOne({ shortCode }).lean();
  if (!url) {
    throw new AppError("Short URL not found", 404);
  }

  return url;
};

const getClickQualityCounts = async (urlId) => {
  const rows = await Visit.aggregate([
    { $match: { urlId } },
    {
      $group: {
        _id: null,
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

  const base = rows[0] || {
    humanClicks: 0,
    botClicks: 0,
    suspiciousClicks: 0,
  };

  return base;
};

const getBrowserCounts = async (urlId) => {
  const rows = await Visit.aggregate([
    { $match: { urlId } },
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

const getDeviceCounts = async (urlId) => {
  const rows = await Visit.aggregate([
    { $match: { urlId } },
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

const getDailyTrends = async (urlId) => {
  const rows = await Visit.aggregate([
    { $match: { urlId } },
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

const getPublicStats = async (shortCode) => {
  const url = await getUrlByShortCode(shortCode);
  const [quality, browsers, devices, trends] = await Promise.all([
    getClickQualityCounts(url._id),
    getBrowserCounts(url._id),
    getDeviceCounts(url._id),
    getDailyTrends(url._id),
  ]);

  return {
    totalClicks: url.clickCount || 0,
    humanClicks: quality.humanClicks,
    botClicks: quality.botClicks,
    suspiciousClicks: quality.suspiciousClicks,
    browsers,
    devices,
    trends,
  };
};

module.exports = {
  getPublicStats,
};
