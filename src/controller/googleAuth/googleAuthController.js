import User from "../../models/user/user.js";
import ApiError from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const googleAuth = asyncHandler(async (req, res, next) => {
  const { uid, username, email, userRole, fcmToken } = req.body;
  if (!uid || !username || !email || !userRole) {
    return next(new ApiError("All fields are required", 400));
  }
  let existingUser = await User.findOne({ email });
  if (!existingUser) {
    // Create a new user if they don't exist
    existingUser = new User({ uid, username, email, userRole, fcmToken });
    await existingUser.save();
  } else if (!existingUser.uid) {
    // If the user exists but doesn't have a googleId, add it
    existingUser.uid = uid;
    existingUser.userRole = userRole; // previous role will be replaced by google login user role
    existingUser.fcmToken = fcmToken; //Need to update it every time when login
    await existingUser.save();
  }
  const token = existingUser.generateAccessToken();

  res.status(201).json({
    success: true,
    message: "User successfully authenticated with Google.",
    token,
    user: {
      _id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
      userRole: existingUser.userRole,
      fcmToken: existingUser.fcmToken,
    },
  });
});
