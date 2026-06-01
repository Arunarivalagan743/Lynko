const { AppError } = require("../utils/AppError");

const requireOwnership = (getOwnerId) => (req, _res, next) => {
  const ownerId = getOwnerId(req);
  if (!ownerId) {
    return next(new AppError("Ownership check failed", 403));
  }

  if (String(ownerId) !== String(req.user?.id)) {
    return next(new AppError("Forbidden", 403));
  }

  return next();
};

module.exports = { requireOwnership };
