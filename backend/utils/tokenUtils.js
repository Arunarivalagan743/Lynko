const crypto = require("crypto");

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const generateOpaqueToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};

module.exports = {
  hashToken,
  generateOpaqueToken,
};
