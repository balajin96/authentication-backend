import AppError from "../utils/AppError.js";

export const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 100,
  keyPrefix = "global",
} = {}) => {
  const buckets = new Map();

  return (req, _res, next) => {
    const now = Date.now();
    const key = `${keyPrefix}:${req.ip}`;
    const existing = buckets.get(key);

    if (!existing || existing.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    if (existing.count >= max) {
      next(new AppError("Too many requests, please try again later", 429));
      return;
    }

    existing.count += 1;
    buckets.set(key, existing);

    if (buckets.size > 10000) {
      for (const [bucketKey, value] of buckets) {
        if (value.resetAt <= now) {
          buckets.delete(bucketKey);
        }
      }
    }

    next();
  };
};
