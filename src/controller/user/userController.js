import { uploadFileToCloudinary } from "../../configs/cloudinary.js";
import Comment from "../../models/comment/comment.js";
// import user from "../../models/user/user.js";
import User from "../../models/user/user.js";
import ApiError from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

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

// export const forgotPassword = asyncHandler(async (req, res, next) => {
//   const { email } = req.body;
//   if (!email) {
//     return next(new ApiError("Email is required", 400));
//   }

//   const existingUser = await User.findOne({ email });
//   if (!existingUser) return next(new ApiError("No user found!!", 400));

//   const resetToken = jwt.sign(
//     { userId: existingUser._id, email },
//     process.env.JWT_SECRET_KEY,
//     {
//       expiresIn: "1d",
//     }
//   );
//   await sendForgotPasswordMail(email, resetToken)
//     .then(() => {
//       return res.status(200).json({
//         success: true,
//         message:
//           "Mail sent successfully. Please check your email, including the spam or junk folder to reset your password.",
//       });
//     })
//     .catch((error) => {
//       res.status(400).json({
//         success: false,
//         message: `Unable to send mail! ${error.message}`,
//       });
//     });
// });

// export const resetPassword = asyncHandler(async (req, res, next) => {
//   const { newPassword, confirmNewPassword } = req.body;
//   const { token } = req.params;
//   if (!newPassword || !confirmNewPassword) {
//     return next(new ApiError("All field are required", 400));
//   }
//   if (newPassword !== confirmNewPassword) {
//     return next(new ApiError("New passwords do not match", 400));
//   }
//   const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//   if (!decoded) {
//     return next(new ApiError("Invalid token", 400));
//   }

//   const user = await User.findById(decoded.userId);
//   if (!user) {
//     return next(new ApiError("User not found", 401));
//   }
//   user.password = newPassword;
//   await user.save();
//   return res
//     .status(200)
//     .json({ success: true, message: "Password reset successfully" });
// });


export const getSellerComments = asyncHandler(async (req, res, next) => {
  const myComments = await Comment.find({ userId: req.user?._id });
  if (!myComments || myComments.length === 0) {
    return next(new ApiError("No comments found", 404));
  }
  return res
    .status(200)
    .json(new ApiResponse("Comments retrieved successfully.", myComments, 200));
});
