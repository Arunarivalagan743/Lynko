const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const { AppError } = require("../utils/AppError");

const authenticate = (req, _res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return next(new AppError("Unauthorized", 401));
  }

  try {
    const payload = jwt.verify(token, env.jwt.accessSecret);
    req.user = {
      id: payload.sub,
      role: payload.role,
    };
    return next();
  } catch (_err) {
    return next(new AppError("Unauthorized", 401));
  }
};

module.exports = { authenticate };
