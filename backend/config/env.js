const dotenv = require("dotenv");

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";

dotenv.config({ path: envFile });

const required = [
  "MONGODB_URI",
  "JWT_ACCESS_SECRET",
  "JWT_ACCESS_EXPIRES_IN",
  "JWT_REFRESH_SECRET",
  "JWT_REFRESH_EXPIRES_IN",
  "RESET_TOKEN_EXPIRES_IN",
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 4000),
  mongodbUri: process.env.MONGODB_URI,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  resetTokenExpiresIn: process.env.RESET_TOKEN_EXPIRES_IN,
  safeBrowsingApiKey: process.env.SAFE_BROWSING_API_KEY,
  virusTotalApiKey: process.env.VIRUSTOTAL_API_KEY,
  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
    : ["https://lynko-three.vercel.app", "http://localhost:5173", "http://localhost:3000"],
};

module.exports = { env };
