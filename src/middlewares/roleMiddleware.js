import AppError from "../utils/AppError.js";

export const authorizeRoles = (...allowedRoles) => (req, _res, next) => {
  if (!req.auth?.role) {
    next(new AppError("Authentication context missing", 401));
    return;
  }

  if (!allowedRoles.includes(req.auth.role)) {
    next(new AppError("Access denied: insufficient permissions", 403));
    return;
  }

  next();
};
