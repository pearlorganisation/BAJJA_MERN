import { uploadFileToCloudinary } from "../../configs/cloudinary.js";
import user from "../../models/user/user.js";
import User from "../../models/user/user.js";
import ApiError from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id).select("-password");
    if (!user) {
      return res.status(200).json({ success: true, user });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error: ", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updateUserProfile = asyncHandler(async (req, res, next) => {
  const reqBody = req.body;
  
  const profilePic = req.file;
  console.log(profilePic);
  const filterReqObj = {};
  const allowedFields = ["profilePic", "userName", "phoneNumber"];
  const hasValidFields = Object.keys(reqBody).some((key) =>
    allowedFields.includes(key)
  );

  if (!hasValidFields && !profilePic) {
    return next(new ApiError("No valid fields provided to update", 400));
  }
  Object.keys(reqBody).forEach((key) => {
    if (allowedFields.includes(key)) {
      filterReqObj[key] = reqBody[key];
    }
  });
  if (profilePic) {
    const response = await uploadFileToCloudinary(profilePic);
    if (response.status && response.result.length > 0) {
      filterReqObj.profilePic = response.result[0].secure_url;
    }
  }
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filterReqObj, {
    runValidators: true,
    new: true,
  });
  if (!updatedUser) {
    return next(new ApiError("User is not updated", 400));
  }
  return res
    .status(200)
    .json({ success: true, message: "User is updated", user: updatedUser });
});
