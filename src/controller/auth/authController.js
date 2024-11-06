import User from "../../models/user/user.js";
import bcrypt from "bcrypt";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import { COOKIE_OPTIONS } from "../../../constants.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export const signup = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, username, email, password, userRole, fcmToken } =
    req.body;

  if (!firstName || !lastName || !username || !email || !password) {
    return next(new ApiError("All fields are required", 400));
  }
  const existingUsername = await User.findOne({ username: req.body?.username });
  if (existingUsername) {
    return next(new ApiError("Username must be unique", 400));
  }

  const existingUserEmail = await User.findOne({ email: req.body?.email });
  if (existingUserEmail) {
    return next(new ApiError("User already exists", 400));
  }
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!regex.test(req.body?.password)) {
    return next(
      new ApiError(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
        400
      )
    );
  }
  const newUser = await User.create({
    ...req?.body,
  });

  res.status(201).json({
    success: true,
    message: "User register successfully",
    data: { userId: newUser._id },
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password, fcmToken } = req.body;
  if (!email || !password) {
    return next(new ApiError("All fields are required", 400));
  }

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return next(new ApiError("No user found", 404));
  }

  const isValidPassword = await existingUser.isPasswordCorrect(password);
  if (!isValidPassword) {
    return next(new ApiError("Wrong password", 401));
  }

  // Update FCM token if provided
  if (fcmToken) {
    existingUser.fcmToken = fcmToken;
    await existingUser.save();
  }

  const api_key = existingUser.generateAccessToken();
  existingUser.password = undefined;
  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    api_key,
    user: {
      _id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
      userRole: existingUser.userRole,
      fcmToken: existingUser.fcmToken,
    },
  });
});

export const logout = asyncHandler(async (req, res, next) => {
  try {
    res
      .cookie("access-token", "", { ...COOKIE_OPTIONS, maxAge: 0 })
      .status(200)
      .json(new ApiResponse("Logout successfully", null, 200));
  } catch (error) {
    console.log(`Error in logout: ${error.message}`);
    return next(new ApiError("Error in logout", 500));
  }
});
