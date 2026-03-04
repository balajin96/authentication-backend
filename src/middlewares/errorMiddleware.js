import { logger } from "../config/logger.js";
import AppError from "../utils/AppError.js";

const normalizeKnownErrors = (err) => {
  if (err.code === 11000) {
    return new AppError("Resource already exists", 409);
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
    return new AppError(message || "Validation failed", 400);
  }

  if (err.name === "CastError") {
    return new AppError("Invalid identifier format", 400);
  }

  if (err.message === "Not allowed by CORS") {
    return new AppError("Origin is not allowed", 403);
  }

  return err;
};

export const notFoundHandler = (req, _res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

export const errorHandler = (err, req, res, _next) => {
  const normalizedError = normalizeKnownErrors(err);
  const statusCode = normalizedError.statusCode || 500;
  const message =
    normalizedError.isOperational || statusCode < 500
      ? normalizedError.message
      : "Internal server error";

  logger.error("request_failed", {
    requestId: req.requestId,
    method: req.method,
    path: req.originalUrl,
    statusCode,
    message: normalizedError.message,
  });

  res.status(statusCode).json({
    status: statusCode < 500 ? "fail" : "error",
    requestId: req.requestId,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: normalizedError.stack }),
  });
};
