const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { User } = require("../model/User");
const { RefreshToken } = require("../model/RefreshToken");
const { PasswordResetToken } = require("../model/PasswordResetToken");
const { env } = require("../config/env");
const { AppError } = require("../utils/AppError");
const { hashToken, generateOpaqueToken } = require("../utils/tokenUtils");
const { parseDurationMs } = require("../utils/timeUtils");

const BCRYPT_ROUNDS = 12;

const generateAccessToken = (user) => {
  return jwt.sign(
    { role: user.role },
    env.jwt.accessSecret,
    {
      subject: String(user._id),
      expiresIn: env.jwt.accessExpiresIn,
    }
  );
};

const createRefreshToken = async (user, metadata = {}, familyId) => {
  if (!env.jwt.refreshSecret || !env.jwt.refreshExpiresIn) {
    throw new AppError("Refresh tokens not configured", 500);
  }

  const token = jwt.sign(
    { fid: familyId },
    env.jwt.refreshSecret,
    {
      subject: String(user._id),
      expiresIn: env.jwt.refreshExpiresIn,
      jwtid: crypto.randomUUID(),
    }
  );

  const decoded = jwt.decode(token);
  const expiresAt = new Date(decoded.exp * 1000);
  const tokenHash = hashToken(token);

  await RefreshToken.create({
    userId: user._id,
    tokenHash,
    familyId,
    expiresAt,
    createdByIp: metadata.ip || null,
    userAgent: metadata.userAgent || null,
  });

  return token;
};

const revokeFamily = async (familyId) => {
  await RefreshToken.updateMany(
    { familyId, revokedAt: null },
    { revokedAt: new Date() }
  );
};

const rotateRefreshToken = async (refreshToken, metadata = {}) => {
  let payload;
  try {
    payload = jwt.verify(refreshToken, env.jwt.refreshSecret);
  } catch (_err) {
    throw new AppError("Unauthorized", 401);
  }

  const tokenHash = hashToken(refreshToken);
  const stored = await RefreshToken.findOne({ tokenHash });
  if (!stored) {
    throw new AppError("Unauthorized", 401);
  }

  if (stored.revokedAt) {
    await revokeFamily(stored.familyId);
    throw new AppError("Unauthorized", 401);
  }

  if (stored.expiresAt <= new Date()) {
    throw new AppError("Unauthorized", 401);
  }

  const user = await User.findById(payload.sub).lean();
  if (!user || !user.isActive) {
    throw new AppError("Unauthorized", 401);
  }

  const newRefreshToken = await createRefreshToken(
    user,
    metadata,
    stored.familyId
  );

  stored.revokedAt = new Date();
  stored.replacedByTokenHash = hashToken(newRefreshToken);
  await stored.save();

  const accessToken = generateAccessToken(user);

  return { accessToken, refreshToken: newRefreshToken };
};

const revokeRefreshToken = async (refreshToken) => {
  let payload;
  try {
    payload = jwt.verify(refreshToken, env.jwt.refreshSecret);
  } catch (_err) {
    return;
  }

  const tokenHash = hashToken(refreshToken);
  const stored = await RefreshToken.findOne({
    tokenHash,
    userId: payload.sub,
  });

  if (stored && !stored.revokedAt) {
    stored.revokedAt = new Date();
    await stored.save();
  }
};

const revokeAllRefreshTokens = async (userId) => {
  await RefreshToken.updateMany(
    { userId, revokedAt: null },
    { revokedAt: new Date() }
  );
};

const registerUser = async ({ email, password }, metadata = {}) => {
  const existing = await User.findOne({ email }).lean();
  if (existing) {
    throw new AppError("Email already in use", 409);
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user = await User.create({ email, passwordHash });

  const accessToken = generateAccessToken(user);
  const familyId = crypto.randomUUID();
  const refreshToken = await createRefreshToken(user, metadata, familyId);

  return { user, accessToken, refreshToken };
};

const loginUser = async ({ email, password }, metadata = {}) => {
  const user = await User.findOne({ email }).select("+passwordHash");

  if (!user || !user.isActive) {
    throw new AppError("Invalid credentials", 401);
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    throw new AppError("Invalid credentials", 401);
  }

  user.lastLoginAt = new Date();
  await user.save();

  const accessToken = generateAccessToken(user);
  const familyId = crypto.randomUUID();
  const refreshToken = await createRefreshToken(user, metadata, familyId);

  return { user, accessToken, refreshToken };
};

const requestPasswordReset = async ({ email }, metadata = {}) => {
  const user = await User.findOne({ email }).lean();
  if (!user) {
    return { resetToken: null, expiresAt: null };
  }

  const token = generateOpaqueToken(32);
  const tokenHash = hashToken(token);
  const ttlMs = parseDurationMs(env.resetTokenExpiresIn) || 15 * 60 * 1000;
  const expiresAt = new Date(Date.now() + ttlMs);

  await PasswordResetToken.create({
    userId: user._id,
    tokenHash,
    expiresAt,
    requestedByIp: metadata.ip || null,
    userAgent: metadata.userAgent || null,
  });

  return { resetToken: token, expiresAt };
};

const resetPassword = async ({ token, password }) => {
  const tokenHash = hashToken(token);
  const record = await PasswordResetToken.findOne({ tokenHash });

  if (!record || record.usedAt || record.expiresAt <= new Date()) {
    throw new AppError("Invalid or expired reset token", 400);
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user = await User.findById(record.userId).select("+passwordHash");

  if (!user) {
    throw new AppError("Invalid or expired reset token", 400);
  }

  user.passwordHash = passwordHash;
  await user.save();

  record.usedAt = new Date();
  await record.save();

  await revokeAllRefreshTokens(user._id);
};

module.exports = {
  registerUser,
  loginUser,
  rotateRefreshToken,
  revokeRefreshToken,
  revokeAllRefreshTokens,
  requestPasswordReset,
  resetPassword,
};
