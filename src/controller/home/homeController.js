import Product from "../../models/product/product.js";
import Favourite from "../../models/favourite/favourite.js";
import ApiError from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getAllProductPosts = asyncHandler(async (req, res, next) => {
  const userRole = req.user.role;
  const userId = req.user._id; // User ID for fetching favourites

  let filter = {};
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Set filter based on user role
  if (userRole === "buyer") {
    filter = { userId }; // Buyer can see only their posts
  } else if (userRole === "seller") {
    filter = {
      $or: [
        { createdAt: { $gte: twentyFourHoursAgo } },
        { updatedAt: { $gte: twentyFourHoursAgo } },
      ],
    }; // Seller sees posts from the last 24 hours
  } else {
    return next(new ApiError("Access denied", 403));
  }

  // Fetch product posts first
  const productPosts = await Product.find(filter)
    .sort({ createdAt: -1, updatedAt: -1 })
    .limit(24)
    .populate({
      path: "userId",
      select: "-password", // Exclude password from populated user data
    });

  if (productPosts.length === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse("No product posts found in the last 24 hours.", [], 200)
      );
  }

  // Extract product IDs
  const productIds = productPosts.map((product) => product._id);

  // Fetch the favourite items for the user that match the product IDs
  const favourite = await Favourite.findOne({
    userId,
    // productPost: { $in: productIds },
  });
  const favouriteProductIds = favourite
    ? favourite.productPost.map((p) => p.toString())
    : [];

  // Use $in to check which product posts are in the favourites
  const productsWithFavouriteStatus = productPosts.map((product) => ({
    ...product._doc, // Spread all product fields
    isInFavourite: favouriteProductIds.includes(product._id.toString()), // Check if product is in favourites
  }));

  // Respond with product posts including favourites status
  res
    .status(200)
    .json(
      new ApiResponse(
        "All product posts found.",
        productsWithFavouriteStatus,
        200
      )
    );
});
