import User from "../../models/user/user.js";
import bcrypt from "bcrypt";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";

export const signup = asyncHandler(async (req, res, next) => {
  const { userName, email, password, userRole } = req.body;
  if (!userName || !email || !password) {
    return next(new ApiError("All fields are required", 400));
  }
  let existingUser = await User.findOne({ userName });
  if (existingUser) {
    return next(new ApiError("User name must be unique", 400));
  }
  existingUser = await User.findOne({ email });

  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!regex.test(password)) {
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

  res
    .status(201)
    .json({ success: true, message: "User register successfully" });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
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

  const api_key = existingUser.generateAccessToken();
  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    api_key,
    userName: existingUser.userName,
    email: existingUser.email,
    userRole: existingUser.userRole,
  });
});
