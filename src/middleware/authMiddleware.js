import User from "../models/user/user.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

export const authenticateToken = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.api_key || req.header("authorization")?.split(" ")[1];
  if (!token) return next(new ApiError("Unauthorized user", 401));
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const userDoc = await User.findById(decoded._id).select("userRole");
  if (!userDoc) {
    return next(new ApiError("No user found", 401));
  }
  req.user = { _id: decoded._id, role: userDoc.userRole };
  next();
});

export const verifyPermission = (roles = []) =>
  asyncHandler(async (req, res, next) => {
    if (!req.user?._id) {
      return next(new ApiError("Unauthorized request", 401));
    }
    if (roles.includes(req.user?.role)) {
      next();
    } else {
      return next(new ApiError("Access denied", 403));
    }
  });
