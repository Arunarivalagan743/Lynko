const { nanoid } = require("nanoid");
const QRCode = require("qrcode");
const { Url } = require("../model/Url");
const { AppError } = require("../utils/AppError");
const { validateUrlSafety } = require("./urlSafetyService");

const SHORT_CODE_LENGTH = 8;
const MAX_COLLISION_RETRIES = 5;

const generateShortCode = () => nanoid(SHORT_CODE_LENGTH);

const buildShortUrl = (baseUrl, shortCode) => {
  if (!baseUrl) {
    return null;
  }

  const trimmed = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  return `${trimmed}/r/${shortCode}`;
};

const generateQrCodeDataUrl = async (shortUrl) => {
  if (!shortUrl) {
    return null;
  }

  return QRCode.toDataURL(shortUrl, { errorCorrectionLevel: "M" });
};

const createShortUrl = async ({ ownerId, originalUrl, customAlias, expiresAt, baseUrl }) => {
  if (!ownerId) {
    throw new AppError("Unauthorized", 401);
  }

  const safety = await validateUrlSafety(originalUrl);
  if (!safety.isSafe) {
    throw new AppError("URL failed safety checks", 400, {
      threats: safety.threats,
      riskLevel: safety.riskLevel,
      source: safety.source,
    });
  }

  if (customAlias) {
    const existing = await Url.findOne({ shortCode: customAlias }).lean();
    if (existing) {
      throw new AppError("Alias already exists", 409);
    }

    const url = await Url.create({
      ownerId,
      originalUrl,
      shortCode: customAlias,
      expiresAt: expiresAt || null,
    });
    const shortUrl = buildShortUrl(baseUrl, url.shortCode);
    const qrCodeDataUrl = await generateQrCodeDataUrl(shortUrl);

    return { url, qrCodeDataUrl };
  }

  for (let attempt = 0; attempt < MAX_COLLISION_RETRIES; attempt += 1) {
    const shortCode = generateShortCode();

    try {
      const url = await Url.create({
        ownerId,
        originalUrl,
        shortCode,
        expiresAt: expiresAt || null,
      });
      const shortUrl = buildShortUrl(baseUrl, url.shortCode);
      const qrCodeDataUrl = await generateQrCodeDataUrl(shortUrl);

      return { url, qrCodeDataUrl };
    } catch (err) {
      if (err && err.code === 11000) {
        continue;
      }
      throw err;
    }
  }

  throw new AppError("Unable to generate unique short code", 500);
};

const getUserUrls = async (ownerId) => {
  if (!ownerId) {
    throw new AppError("Unauthorized", 401);
  }

  return Url.find({ ownerId }).sort({ createdAt: -1 }).lean();
};

const getUrlById = async (ownerId, urlId) => {
  if (!ownerId) {
    throw new AppError("Unauthorized", 401);
  }

  const url = await Url.findOne({ _id: urlId, ownerId }).lean();
  if (!url) {
    throw new AppError("URL not found", 404);
  }

  return url;
};

const deleteUrlById = async (ownerId, urlId) => {
  if (!ownerId) {
    throw new AppError("Unauthorized", 401);
  }

  const url = await Url.findOneAndDelete({ _id: urlId, ownerId }).lean();
  if (!url) {
    throw new AppError("URL not found", 404);
  }

  return url;
};

const updateUrlById = async (ownerId, urlId, updates) => {
  if (!ownerId) {
    throw new AppError("Unauthorized", 401);
  }

  if (!updates || (!updates.originalUrl && !updates.expiresAt)) {
    throw new AppError("No updates provided", 400);
  }

  if (updates.originalUrl) {
    const safety = await validateUrlSafety(updates.originalUrl);
    if (!safety.isSafe) {
      throw new AppError("URL failed safety checks", 400, {
        threats: safety.threats,
        riskLevel: safety.riskLevel,
        source: safety.source,
      });
    }
  }

  const url = await Url.findOneAndUpdate(
    { _id: urlId, ownerId },
    { $set: updates },
    { new: true }
  ).lean();

  if (!url) {
    throw new AppError("URL not found", 404);
  }

  return url;
};

module.exports = {
  createShortUrl,
  getUserUrls,
  getUrlById,
  deleteUrlById,
  updateUrlById,
};
