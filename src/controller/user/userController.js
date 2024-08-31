import { uploadFileToCloudinary } from "../../configs/cloudinary.js";
// import user from "../../models/user/user.js";
import User from "../../models/user/user.js";
import ApiError from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import bcrypt from "bcrypt";

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select("-password");
  if (!user) {
    return next(new ApiError("User not found", 404));
  }
  return res.status(200).json({ success: true, user });
});

export const updateUserProfile = asyncHandler(async (req, res, next) => {
  const reqBody = req.body;
  const profilePic = req.file;

  const filterReqObj = {};
  const allowedFields = [
    "profilePic",
    "userName",
    "new_password",
    "confirm_new_password",
  ];
  const hasValidFields = Object.keys(reqBody).some((key) =>
    allowedFields.includes(key)
  );

  if (!hasValidFields && !profilePic) {
    return next(new ApiError("No valid fields provided to update", 400));
  }

  // Handle new password and confirm password
  if (reqBody.new_password || reqBody.confirm_new_password) {
    if (!reqBody.new_password || !reqBody.confirm_new_password) {
      return next(
        new ApiError(
          "Both new password and confirm new password are required",
          400
        )
      );
    }

    if (reqBody.new_password !== reqBody.confirm_new_password) {
      return next(
        new ApiError("New password and confirm new password do not match", 400)
      );
    }
    const salt = await bcrypt.genSalt(10);
    filterReqObj.password = await bcrypt.hash(reqBody.new_password, salt);
  }

  // Filter out allowed fields from reqBody
  Object.keys(reqBody).forEach((key) => {
    if (allowedFields.includes(key)) {
      if (key !== "new_password" && key !== "confirm_new_password") {
        filterReqObj[key] = reqBody[key];
      }
    }
  });

  // Handle profile picture upload
  if (profilePic) {
    const response = await uploadFileToCloudinary(profilePic);
    if (response.status && response.result.length > 0) {
      filterReqObj.profilePic = response.result[0].secure_url;
    }
  }

  // Update user
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filterReqObj, {
    runValidators: true,
    new: true,
  }).select("-password");

  if (!updatedUser) {
    return next(new ApiError("User is not updated", 400));
  }

  return res.status(200).json({
    success: true,
    message: "User is updated",
    user: updatedUser,
  });
});

// Change password controller
export const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!req.user._id) {
    return next(new ApiError("Unauthorized User", 401));
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ApiError("User not found", 401));
  }

  const isPasswordValid = await user.isPasswordCorrect(currentPassword);
  if (!isPasswordValid) {
    return next(new ApiError("Wrong password", 400));
  }
  if (newPassword === currentPassword) {
    return next(
      new ApiError("New password can not be same as current password", 400)
    );
  }

  if (newPassword !== confirmNewPassword) {
    return next(new ApiError("New passwords do not match", 400));
  }

  user.password = newPassword;
  await user.save();
  return res
    .status(200)
    .json({ success: true, message: "Password changed successfully" });
});
