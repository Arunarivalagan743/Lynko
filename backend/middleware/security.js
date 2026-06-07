const { env } = require("../config/env");
const { AppError } = require("../utils/AppError");

// Custom Cookie Parser Middleware
const cookieParser = (req, res, next) => {
  const cookieHeader = req.headers.cookie;
  req.cookies = {};
  if (cookieHeader) {
    cookieHeader.split(";").forEach((cookie) => {
      const parts = cookie.split("=");
      const name = parts.shift().trim();
      const value = parts.join("=");
      try {
        req.cookies[name] = decodeURIComponent(value);
      } catch (_err) {
        req.cookies[name] = value;
      }
    });
  }
  next();
};

// NoSQL Injection Sanitization
const sanitizeMongoValue = (obj) => {
  if (obj instanceof Object && !(obj instanceof Date)) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (key.startsWith("$") || key.includes(".")) {
          delete obj[key];
        } else {
          sanitizeMongoValue(obj[key]);
        }
      }
    }
  }
  return obj;
};

const mongoSanitize = (req, res, next) => {
  if (req.body) sanitizeMongoValue(req.body);
  if (req.query) sanitizeMongoValue(req.query);
  if (req.params) sanitizeMongoValue(req.params);
  next();
};

// XSS Sanitization (Escaping < and > to prevent script tags)
const sanitizeXSSValue = (val) => {
  if (typeof val === "string") {
    return val
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  } else if (val instanceof Object && !(val instanceof Date)) {
    for (const key in val) {
      if (Object.prototype.hasOwnProperty.call(val, key)) {
        val[key] = sanitizeXSSValue(val[key]);
      }
    }
  }
  return val;
};

const xssSanitize = (req, res, next) => {
  if (req.body) req.body = sanitizeXSSValue(req.body);
  if (req.query) req.query = sanitizeXSSValue(req.query);
  if (req.params) req.params = sanitizeXSSValue(req.params);
  next();
};

// CSRF Protection (Origin / Referer Checking for State-Changing Requests)
const csrfProtect = (req, res, next) => {
  const stateChangingMethods = ["POST", "PUT", "PATCH", "DELETE"];
  if (!stateChangingMethods.includes(req.method)) {
    return next();
  }

  const origin = req.headers.origin;
  const referer = req.headers.referer;

  const isAllowedOrigin = (urlStr) => {
    if (!urlStr) return false;
    try {
      const url = new URL(urlStr);
      return env.allowedOrigins.some((allowed) => {
        const allowedUrl = new URL(allowed);
        return url.origin === allowedUrl.origin;
      });
    } catch (_err) {
      return false;
    }
  };

  if (origin || referer) {
    const originValid = origin ? isAllowedOrigin(origin) : true;
    const refererValid = referer ? isAllowedOrigin(referer) : true;

    if (!originValid && !refererValid) {
      return next(new AppError("CORS/CSRF Blocked: Unauthorized request origin", 403));
    }
  }

  next();
};

module.exports = {
  cookieParser,
  mongoSanitize,
  xssSanitize,
  csrfProtect,
};
