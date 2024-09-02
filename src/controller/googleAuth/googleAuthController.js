import User from "../../models/user/user.js";
import ApiError from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const googleAuth = asyncHandler(async (req, res, next) => {
  const { uid, username, email, userRole } = req.body;
  if (!uid || !username || !email || !userRole) {
    return next(new ApiError("All fields are required", 400));
  }
  let existingUser = await User.findOne({ email });
  if (!existingUser) {
    // Create a new user if they don't exist
    existingUser = new User({ uid, username, email, userRole });
    await existingUser.save();
  } else if (!existingUser.uid) {
    // If the user exists but doesn't have a googleId, add it
    existingUser.uid = uid;
    existingUser.userRole = userRole;
    await existingUser.save();
  }
  const token = existingUser.generateAccessToken();

  res.status(201).json({
    success: true,
    message: "User successfully authenticated with Google.",
    token,
    userRole: existingUser.userRole,
  });
});
