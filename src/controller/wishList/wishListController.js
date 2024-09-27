import Product from "../../models/product/product.js";
import WishList from "../../models/wishList/wishList.js";
import ApiError from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const addToWishList = asyncHandler(async (req, res, next) => {
  const { productPostId } = req.body;
  const userId = req.user._id;

  // Check if productPostId is provided
  if (!productPostId) {
    return next(new ApiError("Product post ID is required", 400));
  }
  const productExists = await Product.findById(productPostId);

  if (!productExists) {
    return next(new ApiError("Product post not found", 404));
  }

  let wishList = await WishList.findOne({ userId });
  if (!wishList) {
    wishList = await WishList.create({ userId, productPost: [] });
  }

  if (!wishList.productPost.includes(productPostId)) {
    // avoid duplication of same id
    wishList.productPost.push(productPostId);
    await wishList.save();
  }

  return res
    .status(200)
    .json(
      new ApiResponse("Product added to wishlist successfully", wishList, 200)
    );
});

export const removeFromWishList = asyncHandler(async (req, res, next) => {
  const { productPostId } = req.body;
  const userId = req.user._id;

  // Check if productPostId is provided
  if (!productPostId) {
    return next(new ApiError("Product post ID is required", 400));
  }

  const productExists = await Product.findById(productPostId);
  if (!productExists) {
    return next(new ApiError("Product post not found", 404));
  }
  const wishList = await WishList.findOne({ userId });
  if (!wishList) {
    return next(new ApiError("Wish List not found", 404));
  }
  // Check if the product is in the wishlist
  if (!wishList.productPost.includes(productPostId)) {
    return next(new ApiError("Product post not found in wishlist", 404));
  }

  // Remove the product from the wishlist
  wishList.productPost = wishList.productPost.filter(
    (productPost) => productPost.toString() !== productPostId
  );
  await wishList.save();
  return res
    .status(200)
    .json(
      new ApiResponse(
        "Product post removed from wishlist successfully",
        wishList,
        200
      )
    );
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
