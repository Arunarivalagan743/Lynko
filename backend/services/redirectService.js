const { Url } = require("../model/Url");
const { Visit } = require("../model/Visit");
const { AppError } = require("../utils/AppError");

const normalizeValue = (value) => {
  if (!value || typeof value !== "string") {
    return "unknown";
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : "unknown";
};

const detectBot = (userAgent) => {
  const ua = userAgent.toLowerCase();

  if (ua.includes("googlebot")) {
    return { isBot: true, botType: "googlebot" };
  }
  if (ua.includes("whatsapp")) {
    return { isBot: true, botType: "whatsapp" };
  }
  if (ua.includes("facebookexternalhit") || ua.includes("facebook")) {
    return { isBot: true, botType: "facebook" };
  }
  if (ua.includes("twitterbot")) {
    return { isBot: true, botType: "twitterbot" };
  }
  if (ua.includes("linkedinbot")) {
    return { isBot: true, botType: "linkedinbot" };
  }
  if (ua.includes("discordbot")) {
    return { isBot: true, botType: "discordbot" };
  }

  return { isBot: false, botType: null };
};

const classifyClick = (userAgent, botInfo) => {
  if (botInfo.isBot) {
    return "bot";
  }

  const ua = userAgent.toLowerCase();
  const suspiciousMarkers = [
    "headlesschrome",
    "puppeteer",
    "playwright",
    "selenium",
  ];

  if (suspiciousMarkers.some((marker) => ua.includes(marker))) {
    return "suspicious";
  }

  return "human";
};

const detectBrowser = (userAgent) => {
  const ua = userAgent.toLowerCase();

  if (ua.includes("edg/")) {
    return "edge";
  }
  if (ua.includes("opr/") || ua.includes("opera")) {
    return "opera";
  }
  if (ua.includes("chrome") && !ua.includes("edg/") && !ua.includes("opr/")) {
    return "chrome";
  }
  if (ua.includes("safari") && !ua.includes("chrome")) {
    return "safari";
  }
  if (ua.includes("firefox")) {
    return "firefox";
  }

  return "unknown";
};

const detectDevice = (userAgent) => {
  const ua = userAgent.toLowerCase();

  if (ua.includes("ipad") || ua.includes("tablet")) {
    return "tablet";
  }
  if (ua.includes("mobile") || ua.includes("iphone") || ua.includes("android")) {
    return "mobile";
  }

  return "desktop";
};

const detectOperatingSystem = (userAgent) => {
  const ua = userAgent.toLowerCase();

  if (ua.includes("windows nt")) {
    return "windows";
  }
  if (ua.includes("android")) {
    return "android";
  }
  if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ios")) {
    return "ios";
  }
  if (ua.includes("mac os x")) {
    return "macos";
  }
  if (ua.includes("linux")) {
    return "linux";
  }

  return "unknown";
};

/**
 * Fetch a Url by short code or throw if it does not exist.
 * @param {string} shortCode
 * @returns {Promise<object>}
 */
const findUrlByShortCode = async (shortCode) => {
  if (!shortCode) {
    throw new AppError("Short code is required", 400);
  }

  const url = await Url.findOne({ shortCode }).lean();
  if (!url) {
    throw new AppError("Short URL not found", 404);
  }

  return url;
};

/**
 * Validate that a Url is not expired.
 * @param {object} url
 */
const validateUrlExpiration = (url) => {
  if (!url) {
    throw new AppError("Short URL not found", 404);
  }

  if (url.expiresAt && url.expiresAt <= new Date()) {
    throw new AppError("Short URL has expired", 410);
  }
};

/**
 * Extract analytics metadata from an incoming request.
 * @param {object} req
 * @returns {object}
 */
const extractVisitMetadata = (req) => {
  const userAgent = req.headers["user-agent"] || "";
  const referrer = req.get("referer") || req.get("referrer") || null;
  const ipAddress = req.ip || null;
  const campaign = req.query?.campaign || req.query?.utm_campaign || null;
  const botInfo = detectBot(userAgent);
  const clickQuality = classifyClick(userAgent, botInfo);

  return {
    timestamp: new Date(),
    browser: normalizeValue(detectBrowser(userAgent)),
    device: normalizeValue(detectDevice(userAgent)),
    operatingSystem: normalizeValue(detectOperatingSystem(userAgent)),
    ipAddress,
    country: null,
    referrer,
    userAgent: userAgent || null,
    campaign,
    isBot: botInfo.isBot,
    botType: botInfo.botType,
    clickQuality,
  };
};

/**
 * Persist a Visit record for analytics.
 * @param {object} url
 * @param {object} metadata
 * @returns {Promise<object>}
 */
const createVisitRecord = async (url, metadata) => {
  return Visit.create({
    urlId: url._id,
    timestamp: metadata.timestamp || new Date(),
    browser: metadata.browser,
    device: metadata.device,
    operatingSystem: metadata.operatingSystem,
    ipAddress: metadata.ipAddress || null,
    country: metadata.country || null,
    referrer: metadata.referrer || null,
    userAgent: metadata.userAgent || null,
    campaign: metadata.campaign || null,
    isBot: metadata.isBot || false,
    botType: metadata.botType || null,
    clickQuality: metadata.clickQuality || "human",
  });
};

/**
 * Increment click count atomically for a Url.
 * @param {string|object} urlId
 * @returns {Promise<void>}
 */
const incrementClickCount = async (urlId) => {
  const result = await Url.updateOne(
    { _id: urlId },
    { $inc: { clickCount: 1 } }
  );

  if (!result || result.matchedCount === 0) {
    throw new AppError("Short URL not found", 404);
  }
};

/**
 * Handle the redirect lookup and analytics write flow.
 * @param {string} shortCode
 * @param {object} req
 * @returns {Promise<string>}
 */
const handleRedirect = async (shortCode, req) => {
  const url = await findUrlByShortCode(shortCode);
  validateUrlExpiration(url);

  const metadata = extractVisitMetadata(req);
  await createVisitRecord(url, metadata);
  await incrementClickCount(url._id);

  return url.originalUrl;
};

module.exports = {
  findUrlByShortCode,
  validateUrlExpiration,
  extractVisitMetadata,
  createVisitRecord,
  incrementClickCount,
  handleRedirect,
};
