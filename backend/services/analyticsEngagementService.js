"use strict";

const { Url } = require("../model/Url");
const { Visit } = require("../model/Visit");
const { AppError } = require("../utils/AppError");

// ─────────────────────────────────────────────────────────────────────────────
// Internal helper: verify the urlId belongs to the requesting user.
// Returns the lean Url document or throws AppError.
// ─────────────────────────────────────────────────────────────────────────────
const assertUrlOwnership = async (ownerId, urlId) => {
  if (!ownerId) throw new AppError("Unauthorized", 401);
  if (!urlId) throw new AppError("URL id is required", 400);

  const url = await Url.findOne({ _id: urlId, ownerId }).lean();
  if (!url) throw new AppError("URL not found or access denied", 404);

  return url;
};

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE 1 – Top Performing Links
// GET /api/analytics/top-links
//
// Returns the current user's 10 best-performing links sorted by clickCount desc.
// Uses Url.clickCount (maintained by redirectService) – a single collection scan
// with a compound index on { ownerId, clickCount } which we recommend adding.
// ─────────────────────────────────────────────────────────────────────────────
const getTopLinks = async (ownerId) => {
  if (!ownerId) throw new AppError("Unauthorized", 401);

  const topLinks = await Url.find({ ownerId })
    .sort({ clickCount: -1 })
    .limit(10)
    .select("shortCode originalUrl clickCount createdAt")
    .lean();

  return topLinks.map((u) => ({
    urlId: u._id,
    shortCode: u.shortCode,
    originalUrl: u.originalUrl,
    clickCount: u.clickCount ?? 0,
    createdAt: u.createdAt,
  }));
};

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE 2 – Referrer Analytics
// GET /api/analytics/referrers/:urlId
//
// Groups Visit.referrer into known source buckets using $switch inside $group.
// No raw referrer strings are ever returned – all values are normalised.
//
// Normalisation map (case-insensitive hostname match):
//   google.com / google.*     → "Google"
//   facebook.com / fb.com     → "Facebook"
//   instagram.com             → "Instagram"
//   linkedin.com              → "LinkedIn"
//   twitter.com / t.co / x.com→ "Twitter"
//   null / empty string       → "Direct"
//   anything else             → "Other"
// ─────────────────────────────────────────────────────────────────────────────
const getReferrerAnalytics = async (ownerId, urlId) => {
  const url = await assertUrlOwnership(ownerId, urlId);

  // We use a $addFields + $group pipeline so normalisation happens inside
  // MongoDB – no JS-level iteration over raw strings.
  const rows = await Visit.aggregate([
    { $match: { urlId: url._id } },
    {
      $addFields: {
        // Lower-case the referrer once; null/missing becomes empty string.
        normRef: {
          $toLower: { $ifNull: ["$referrer", ""] },
        },
      },
    },
    {
      $addFields: {
        source: {
          $switch: {
            branches: [
              // Direct traffic
              {
                case: {
                  $or: [
                    { $eq: ["$normRef", ""] },
                    { $eq: ["$normRef", "direct"] },
                  ],
                },
                then: "Direct",
              },
              // Google
              {
                case: {
                  $or: [
                    { $regexMatch: { input: "$normRef", regex: "google" } },
                    { $regexMatch: { input: "$normRef", regex: "bing" } },
                    { $regexMatch: { input: "$normRef", regex: "duckduckgo" } },
                  ],
                },
                then: "Google",
              },
              // Facebook / Meta
              {
                case: {
                  $or: [
                    { $regexMatch: { input: "$normRef", regex: "facebook" } },
                    { $regexMatch: { input: "$normRef", regex: "fb\\.com" } },
                    { $regexMatch: { input: "$normRef", regex: "fb\\.me" } },
                  ],
                },
                then: "Facebook",
              },
              // Instagram
              {
                case: { $regexMatch: { input: "$normRef", regex: "instagram" } },
                then: "Instagram",
              },
              // LinkedIn
              {
                case: { $regexMatch: { input: "$normRef", regex: "linkedin" } },
                then: "LinkedIn",
              },
              // Twitter / X
              {
                case: {
                  $or: [
                    { $regexMatch: { input: "$normRef", regex: "twitter" } },
                    { $regexMatch: { input: "$normRef", regex: "\\/t\\.co" } },
                    { $regexMatch: { input: "$normRef", regex: "x\\.com" } },
                  ],
                },
                then: "Twitter",
              },
            ],
            // Catch-all bucket
            default: "Other",
          },
        },
      },
    },
    { $group: { _id: "$source", clicks: { $sum: 1 } } },
    { $sort: { clicks: -1 } },
    { $project: { _id: 0, source: "$_id", clicks: 1 } },
  ]);

  return rows;
};

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE 3 – Geographic Analytics
// GET /api/analytics/geography/:urlId
//
// Groups visits by Visit.country.
// Null / missing country is labelled "Unknown".
// Sorted descending by click count.
// ─────────────────────────────────────────────────────────────────────────────
const getGeographyAnalytics = async (ownerId, urlId) => {
  const url = await assertUrlOwnership(ownerId, urlId);

  const rows = await Visit.aggregate([
    { $match: { urlId: url._id } },
    {
      $group: {
        _id: { $ifNull: ["$country", "Unknown"] },
        clicks: { $sum: 1 },
      },
    },
    { $sort: { clicks: -1 } },
    { $project: { _id: 0, country: "$_id", clicks: 1 } },
  ]);

  return rows;
};

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE 4 – Recent Activity Feed
// GET /api/analytics/recent-activity
//
// Returns the latest 20 visits across ALL of the current user's links.
// Two-step pipeline:
//   1. Find all urlIds owned by this user.
//   2. Match visits against those ids, sort by timestamp desc, limit 20.
//
// A $lookup is avoided because we don't want to expose unrelated URL data;
// instead we do a fast `Url.distinct` to get owned ids then a Visit query.
// ─────────────────────────────────────────────────────────────────────────────
const getRecentActivity = async (ownerId) => {
  if (!ownerId) throw new AppError("Unauthorized", 401);

  // Step 1 – collect all url ObjectIds belonging to this user.
  const ownedUrlIds = await Url.distinct("_id", { ownerId });

  if (!ownedUrlIds.length) return [];

  // Step 2 – look up recent visits with a $lookup to resolve shortCode.
  const activities = await Visit.aggregate([
    {
      $match: {
        urlId: { $in: ownedUrlIds },
      },
    },
    { $sort: { timestamp: -1 } },
    { $limit: 20 },
    {
      $lookup: {
        from: "urls",
        localField: "urlId",
        foreignField: "_id",
        as: "urlDoc",
      },
    },
    { $unwind: { path: "$urlDoc", preserveNullAndEmptyArrays: false } },
    {
      $project: {
        _id: 0,
        shortCode: "$urlDoc.shortCode",
        browser: { $ifNull: ["$browser", "unknown"] },
        device: { $ifNull: ["$device", "unknown"] },
        country: { $ifNull: ["$country", "Unknown"] },
        timestamp: "$timestamp",
      },
    },
  ]);

  return activities;
};

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE 5 – Human / Bot Traffic Quality Breakdown
// GET /api/analytics/traffic-quality
//
// Aggregates Visit.clickQuality across ALL of the user's links.
// Returns absolute counts + percentage breakdown (rounded to nearest integer).
// ─────────────────────────────────────────────────────────────────────────────
const getTrafficQuality = async (ownerId) => {
  if (!ownerId) throw new AppError("Unauthorized", 401);

  const ownedUrlIds = await Url.distinct("_id", { ownerId });

  if (!ownedUrlIds.length) {
    return {
      human: 0,
      bot: 0,
      suspicious: 0,
      humanPercentage: 0,
      botPercentage: 0,
      suspiciousPercentage: 0,
    };
  }

  const [result] = await Visit.aggregate([
    { $match: { urlId: { $in: ownedUrlIds } } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        human: {
          $sum: { $cond: [{ $eq: ["$clickQuality", "human"] }, 1, 0] },
        },
        bot: {
          $sum: { $cond: [{ $eq: ["$clickQuality", "bot"] }, 1, 0] },
        },
        suspicious: {
          $sum: { $cond: [{ $eq: ["$clickQuality", "suspicious"] }, 1, 0] },
        },
      },
    },
  ]);

  if (!result) {
    return {
      human: 0,
      bot: 0,
      suspicious: 0,
      humanPercentage: 0,
      botPercentage: 0,
      suspiciousPercentage: 0,
    };
  }

  const { total, human, bot, suspicious } = result;
  const pct = (n) => (total > 0 ? Math.round((n / total) * 100) : 0);

  return {
    human,
    bot,
    suspicious,
    humanPercentage: pct(human),
    botPercentage: pct(bot),
    suspiciousPercentage: pct(suspicious),
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE 6 – Smart Insights (Deterministic, no AI)
// GET /api/analytics/insights/:urlId
//
// Runs four parallel aggregation sub-queries then applies deterministic rules
// to produce plain-English insight strings:
//
//   A. Device  → most-used device
//   B. Browser → dominant browser
//   C. Hour    → peak traffic hour bucket (morning/afternoon/evening/night)
//   D. Country → top country
//
// Each rule fires only when there is meaningful data; silence beats garbage.
// ─────────────────────────────────────────────────────────────────────────────
const getSmartInsights = async (ownerId, urlId) => {
  const url = await assertUrlOwnership(ownerId, urlId);

  // Run all aggregations in parallel – no sequential waterfall.
  const [deviceRows, browserRows, hourRows, countryRows] = await Promise.all([
    // A. Device distribution
    Visit.aggregate([
      { $match: { urlId: url._id } },
      { $group: { _id: { $toLower: "$device" }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]),

    // B. Browser distribution
    Visit.aggregate([
      { $match: { urlId: url._id } },
      { $group: { _id: { $toLower: "$browser" }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]),

    // C. Hourly distribution (UTC hour 0-23)
    Visit.aggregate([
      { $match: { urlId: url._id } },
      {
        $group: {
          _id: { $hour: "$timestamp" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]),

    // D. Country distribution
    Visit.aggregate([
      { $match: { urlId: url._id } },
      {
        $group: {
          _id: { $ifNull: ["$country", "Unknown"] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]),
  ]);

  const insights = [];

  // A. Device insight
  if (deviceRows.length && deviceRows[0]._id && deviceRows[0]._id !== "unknown") {
    const deviceName =
      deviceRows[0]._id.charAt(0).toUpperCase() + deviceRows[0]._id.slice(1);
    insights.push(`Most visitors use ${deviceName} devices`);
  }

  // B. Browser insight
  if (browserRows.length && browserRows[0]._id && browserRows[0]._id !== "unknown") {
    const browserName =
      browserRows[0]._id.charAt(0).toUpperCase() + browserRows[0]._id.slice(1);
    insights.push(`${browserName} is the dominant browser`);
  }

  // C. Hour → time-of-day bucket insight
  if (hourRows.length) {
    const hour = hourRows[0]._id; // UTC hour 0–23
    let period;
    if (hour >= 5 && hour < 12) period = "morning";
    else if (hour >= 12 && hour < 17) period = "afternoon";
    else if (hour >= 17 && hour < 21) period = "evening";
    else period = "night";
    insights.push(`Traffic peaks during ${period} hours`);
  }

  // D. Country insight
  if (
    countryRows.length &&
    countryRows[0]._id &&
    countryRows[0]._id !== "Unknown"
  ) {
    insights.push(
      `${countryRows[0]._id} generates the highest traffic`
    );
  }

  // Fallback when there's no data at all
  if (!insights.length) {
    insights.push("No visit data recorded yet for this link");
  }

  return insights;
};

// ─────────────────────────────────────────────────────────────────────────────
// NEW FEATURE – Platform-Specific Tracking Links Analytics
// GET /api/analytics/platforms/:urlId
// ─────────────────────────────────────────────────────────────────────────────
const getPlatformAnalytics = async (ownerId, urlId) => {
  const url = await assertUrlOwnership(ownerId, urlId);

  if (!url.platforms || url.platforms.length === 0) {
    return [];
  }

  const rows = await Visit.aggregate([
    {
      $match: {
        urlId: url._id,
        platform: { $in: url.platforms },
      },
    },
    {
      $group: {
        _id: "$platform",
        clicks: { $sum: 1 },
      },
    },
  ]);

  const clickMap = new Map(rows.map((row) => [row._id, row.clicks]));

  return url.platforms.map((p) => ({
    platform: p,
    clicks: clickMap.get(p) || 0,
  }));
};

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────
module.exports = {
  getTopLinks,
  getReferrerAnalytics,
  getGeographyAnalytics,
  getRecentActivity,
  getTrafficQuality,
  getSmartInsights,
  getPlatformAnalytics,
};
