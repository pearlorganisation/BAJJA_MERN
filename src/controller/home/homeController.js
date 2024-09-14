import Product from "../../models/product/product.js";
import ApiError from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getAllProductPosts = asyncHandler(async (req, res, next) => {
  const userRole = req.user.role;
  let filter = {};
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  if (userRole === "buyer") {
    filter = { userId: req.user._id }; //Buyer can find his post
  } else if (userRole === "seller") {
    filter = {
      $or: [
        { createdAt: { $gte: twentyFourHoursAgo } },
        { updatedAt: { $gte: twentyFourHoursAgo } },
      ],
    }; // Seller can find all product post whih were created and updated in last 24 hour
  } else {
    return next(new ApiError("Access denied", 403));
  }

  const productPosts = await Product.find(filter)
    .sort({
      createdAt: -1,
      updatedAt: -1,
    })
    .limit(24)
    .populate({
      path: "userId",
      select: "-password", // Exclude the password field from the populated user data
    })
  if (productPosts.length === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse("No product posts found in the last 24 hours.", [], 200)
      );
  }
  res
    .status(200)
    .json(new ApiResponse("All product post found.", productPosts, 200));
});
