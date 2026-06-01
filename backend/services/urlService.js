const { nanoid } = require("nanoid");
const { Url } = require("../model/Url");
const { AppError } = require("../utils/AppError");

const SHORT_CODE_LENGTH = 8;
const MAX_COLLISION_RETRIES = 5;

const generateShortCode = () => nanoid(SHORT_CODE_LENGTH);

const createShortUrl = async ({ ownerId, originalUrl, customAlias, expiresAt }) => {
  if (!ownerId) {
    throw new AppError("Unauthorized", 401);
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

    return url;
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

      return url;
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

module.exports = {
  createShortUrl,
  getUserUrls,
  getUrlById,
  deleteUrlById,
};
