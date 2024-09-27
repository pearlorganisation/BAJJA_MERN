import Product from "../../models/product/product.js";
import WishList from "../../models/wishList/wishList.js";
import ApiError from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const toggleWishList = asyncHandler(async (req, res, next) => {
  const { productPostId } = req.body;
  const userId = req.user._id;

  // Check if productPostId is provided
  if (!productPostId) {
    return next(new ApiError("Product post ID is required", 400));
  }

  // Check if the product exists
  const productExists = await Product.findById(productPostId);
  if (!productExists) {
    return next(new ApiError("Product post not found", 404));
  }

  // Find the user's wishlist
  let wishList = await WishList.findOne({ userId });

  if (!wishList) {
    // Create a new wishlist if it doesn't exist
    wishList = await WishList.create({ userId, productPost: [] });
  }

  const productIndex = wishList.productPost.indexOf(productPostId);

  if (productIndex === -1) {
    // Product is not in the wishlist, add it
    wishList.productPost.push(productPostId);
    await wishList.save();
    return res
      .status(200)
      .json(
        new ApiResponse("Product added to wishlist successfully", wishList, 200)
      );
  } else {
    // Product is in the wishlist, remove it
    wishList.productPost.splice(productIndex, 1);

    // If the wishlist is now empty, delete the entire wishlist document
    if (wishList.productPost.length === 0) {
      await WishList.deleteOne({ _id: wishList._id });
    } else {
      await wishList.save(); // Save the wishlist if it's not empty
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          "Product removed from wishlist successfully",
          wishList,
          200
        )
      );
  }
});

export const getUserWishList = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const wishList = await WishList.findOne({ userId }).populate("productPost");

  if (!wishList || wishList.productPost.length === 0) {
    return next(new ApiError("No products found in your wishlist", 404));
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        "Wishlist fetched successfully",
        wishList.productPost,
        200
      )
    );
});

export const clearUserWishList = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  let wishList = await WishList.findOne({ userId });

  if (!wishList || wishList.productPost.length === 0) {
    return next(new ApiError("No products in wishlist to clear", 404));
  }

  wishList.productPost = [];
  await wishList.save();

  return res
    .status(200)
    .json(new ApiResponse("Wishlist cleared successfully", null, 200));
});