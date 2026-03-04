import jwt from "jsonwebtoken";
import env from "../config/env.js";
import AppError from "../utils/AppError.js";

export const verifyToken = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new AppError("Authentication token is missing", 401));
    return;
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    next(new AppError("Authentication token is missing", 401));
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      issuer: env.JWT_ISSUER,
    });

    const userId = decoded.sub || decoded.id;
    const role = decoded.role;

    if (!userId || !role) {
      next(new AppError("Invalid token payload", 401));
      return;
    }

    req.auth = { userId, role };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      next(new AppError("Authentication token has expired", 401));
      return;
    }

    next(new AppError("Invalid authentication token", 401));
  }
};
