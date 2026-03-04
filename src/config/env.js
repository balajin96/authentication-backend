import dotenv from "dotenv";

dotenv.config();

const requiredVars = ["PORT", "MONGO_URI", "JWT_SECRET"];

for (const key of requiredVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const parseNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseCorsOrigins = (value) => {
  if (!value || value === "*") {
    return ["*"];
  }

  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const env = Object.freeze({
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseNumber(process.env.PORT, 5000),
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
  JWT_ISSUER: process.env.JWT_ISSUER || "rolebasedauth-api",
  BCRYPT_SALT_ROUNDS: parseNumber(process.env.BCRYPT_SALT_ROUNDS, 12),
  CORS_ORIGINS: parseCorsOrigins(process.env.CORS_ORIGINS),
});

export default env;
