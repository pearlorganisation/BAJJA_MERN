import Product from "../../models/product/product.js";
import ApiError from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getAllProductPosts = asyncHandler(async (req, res, next) => {
  const userRole = req.user.role;
  let filter = {};
  if (userRole === "buyer") {
    filter = { userId: req.user._id }; //Buyer can find his post
  } else if (userRole === "seller") {
    filter = {}; // Seller can find all product post
  } else {
    return next(new ApiError("Access denied", 403));
  }
  const productPosts = await Product.find(filter).sort({
    createdAt: -1,
    updatedAt: -1,
  });

  res.status(200).json({
    success: true,
    message: "All product post found",
    data: productPosts,
  });
});
