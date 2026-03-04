import bcrypt from "bcryptjs";
import env from "../config/env.js";
import User from "../models/userModel.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateAccessToken } from "../utils/token.js";
import { ROLE_VALUES, ROLES } from "../constants/roles.js";

const normalizeUsername = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const isStrongPassword = (value) =>
  typeof value === "string" &&
  value.length >= 8 &&
  /[A-Za-z]/.test(value) &&
  /\d/.test(value);

export const register = asyncHandler(async (req, res) => {
  const username = normalizeUsername(req.body.username);
  const password = req.body.password;
  const requestedRole =
    typeof req.body.role === "string" ? req.body.role.trim().toLowerCase() : "";
  const role = requestedRole || ROLES.USER;

  if (!username) {
    throw new AppError("Username is required", 400);
  }

  if (!isStrongPassword(password)) {
    throw new AppError(
      "Password must be at least 8 characters and include letters and numbers",
      400
    );
  }

  if (!ROLE_VALUES.includes(role)) {
    throw new AppError(`Role must be one of: ${ROLE_VALUES.join(", ")}`, 400);
  }

  const existingUser = await User.exists({ username });
  if (existingUser) {
    throw new AppError("Username already in use", 409);
  }

  const hashedPassword = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
  const user = await User.create({
    username,
    password: hashedPassword,
    role,
  });

  res.status(201).json({
    message: "User registered successfully",
    data: {
      id: user.id,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const username = normalizeUsername(req.body.username);
  const password = req.body.password;

  if (!username || typeof password !== "string") {
    throw new AppError("Username and password are required", 400);
  }

  const user = await User.findOne({ username }).select("+password");

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = generateAccessToken({
    userId: user.id,
    role: user.role,
  });

  res.status(200).json({
    message: "Login successful",
    data: {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    },
  });
});
