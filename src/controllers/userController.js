import mongoose from "mongoose";
import { ROLE_VALUES } from "../constants/roles.js";
import User from "../models/userModel.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!mongoose.isValidObjectId(userId)) {
    throw new AppError("Invalid user id", 400);
  }

  if (!ROLE_VALUES.includes(role)) {
    throw new AppError(`Role must be one of: ${ROLE_VALUES.join(", ")}`, 400);
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.role = role;
  await user.save();

  res.status(200).json({
    message: "User role updated successfully",
    data: {
      id: user.id,
      username: user.username,
      role: user.role,
      updatedAt: user.updatedAt,
    },
  });
});
