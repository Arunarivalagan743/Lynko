const { AppError } = require("../utils/AppError");

const errorHandler = (err, _req, res, _next) => {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const message = isAppError ? err.message : "Internal server error";

  const payload = { message };
  if (isAppError && err.details) {
    payload.details = err.details;
  }

  if (process.env.NODE_ENV !== "production") {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
};

module.exports = { errorHandler };
