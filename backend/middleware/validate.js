const { AppError } = require("../utils/AppError");

const validate = (schema, source = "body") => (req, _res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    return next(
      new AppError("Validation error", 400, result.error.flatten())
    );
  }

  req[source] = result.data;
  return next();
};

module.exports = { validate };
