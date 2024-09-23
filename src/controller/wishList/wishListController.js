import Product from "../../models/product/product.js";
import WishList from "../../models/wishList/wishList.js";
import ApiError from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const addToWishList = asyncHandler(async (req, res, next) => {
  const { productPostId } = req.body;
  const userId = req.user._id;
  const productExists = await Product.findById(productPostId);

  if (!productExists) {
    return next(new ApiError("Product post not found", 404));
  }

  let wishList = await WishList.findOne({ userId });
  if (!wishList) {
    wishList = await WishList.create({ userId, productPost: [] });
  }

  if (!wishList.productPost.includes(productPostId)) {
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
