import { USER_ROLES_ENUM } from "../../../constants.js";
import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "../../configs/cloudinary.js";
import Comment from "../../models/comment/comment.js";
import OTP from "../../models/otp/otp.js";
// import user from "../../models/user/user.js";
import User from "../../models/user/user.js";
import ApiError from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { PASSWORD_RESET_REQUEST_TEMPLATE } from "../../utils/email/emailTemplates.js";
import { sendEmail } from "../../utils/email/sendEmailService.js";
import { generateOTP } from "../../utils/generateOTP.js";

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
  const allowedFields = ["profilePic", "username", "firstName", "lastName"];
  const hasValidFields = Object.keys(reqBody).some(
    (
      key //False for empty array, when all test failed
    ) => allowedFields.includes(key)
  );

  if (!hasValidFields && !profilePic) {
    //When nothing is provided
    return next(new ApiError("No valid fields provided to update", 400));
  }

  // Filter out allowed fields from reqBody
  Object.keys(reqBody).forEach((key) => {
    if (allowedFields.includes(key)) {
      filterReqObj[key] = reqBody[key];
    }
  });

  // Find the user to update
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  // Handle profile picture upload
  if (profilePic) {
    const response = await uploadFileToCloudinary(profilePic);
    if (response.success && response.result.length > 0) {
      filterReqObj.profilePic = response.result[0];
      if (user.profilePic && user.profilePic.public_id) {
        await deleteFileFromCloudinary(user.profilePic);
      }
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

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ApiError("Email is required", 400));
  }

  const existingUser = await User.findOne({ email });
  if (!existingUser) return next(new ApiError("No user found.", 400));
  // Generate a new OTP
  const otp = generateOTP();

  //For the first time when user hit this api it return null || If No Document is Found, it returns null.
  const existingOTP = await OTP.findOneAndUpdate(
    { email },
    { $set: { otp } },
    { new: true } // Return updated doc
  );
  if (!existingOTP) {
    await OTP.create({
      email,
      otp,
    });
  }

  const html = PASSWORD_RESET_REQUEST_TEMPLATE(otp);
  await sendEmail({
    email,
    subject: "Your Password Reset OTP",
    html,
  })
    .then(() => {
      return res.status(200).json({
        success: true,
        message:
          "Mail sent successfully. Please check your email, including the spam or junk folder to reset your password.",
      });
    })
    .catch((error) => {
      res.status(400).json({
        success: false,
        message: `Unable to send mail! ${error.message}`,
      });
    });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, otp, newPassword, confirmNewPassword } = req.body;
  if (!email || !otp || !newPassword || !confirmNewPassword) {
    return next(new ApiError("All fields are required", 400));
  }
  if (newPassword !== confirmNewPassword) {
    return next(new ApiError("New passwords do not match", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  //If user exists, check for its otp creation
  const storedOtp = await OTP.findOne({ email, otp });
  if (!storedOtp) {
    //If otp doc deleted automatically means it expires after 5 min
    return next(new ApiError("Invalid or expired OTP", 400));
  }

  user.password = newPassword;
  await user.save();

  //Delete the OTP from the database after successful password reset.
  await OTP.deleteOne({ email, otp });
  return res
    .status(200)
    .json({ success: true, message: "Password reset successfully" });
});

export const getSellerComments = asyncHandler(async (req, res, next) => {
  const myComments = await Comment.find({ userId: req.user?._id });
  if (!myComments || myComments.length === 0) {
    return next(new ApiError("No comments found", 404));
  }
  return res
    .status(200)
    .json(new ApiResponse("Comments retrieved successfully.", myComments, 200));
});

export const deleteUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  if (req.user?._id !== userId) {
    return next(new ApiError("Unauthorized user", 401));
  }
  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deleteUser) {
    return next(new ApiError("User is not deleted", 404));
  }
  return res.status(200).json(new ApiResponse("User is deleted", null, 200));
});

// Toggle user role
export const toggleUserRole = asyncHandler(async (req, res, next) => {
  // Find user by ID
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  // Toggle the user's role
  user.userRole = user.userRole === "buyer" ? "seller" : "buyer";
  const updatedUser = await user.save();

  // Return response with the new role
  return res.status(200).json(
    new ApiResponse("User role toggled successfully", {
      userRole: updatedUser.userRole,
    })
  );
});
