import jwt from "jsonwebtoken";
import env from "../config/env.js";

export const generateAccessToken = ({ userId, role }) =>
  jwt.sign({ sub: userId, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
    issuer: env.JWT_ISSUER,
  });
