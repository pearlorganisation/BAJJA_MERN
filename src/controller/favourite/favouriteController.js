import Product from "../../models/product/product.js";
import Favourite from "../../models/favourite/favourite.js"; // Changed from WishList to Favourite
import ApiError from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const toggleFavouriteList = asyncHandler(async (req, res, next) => {
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

  // Find the user's favourites list
  let favourite = await Favourite.findOne({ userId });

  if (!favourite) {
    // Create a new favourites list if it doesn't exist
    favourite = await Favourite.create({ userId, productPost: [] });
  }

  const productIndex = favourite.productPost.indexOf(productPostId);

  if (productIndex === -1) {
    // Product is not in the favourites, add it
    favourite.productPost.push(productPostId);
    await favourite.save();
    return res
      .status(200)
      .json(
        new ApiResponse(
          "Product added to favourites successfully",
          favourite,
          200
        )
      );
  } else {
    // Product is in the favourites, remove it
    favourite.productPost.splice(productIndex, 1); //

    // If the favourites list is now empty, delete the entire favourites document
    if (favourite.productPost.length === 0) {
      await Favourite.deleteOne({ _id: favourite._id });
    } else {
      await favourite.save(); // Save the favourites list if it's not empty
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          "Product removed from favourites successfully",
          favourite,
          200
        )
      );
  }
});

export const getUserFavouriteList = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const favourite = await Favourite.findOne({ userId }).populate("productPost");
  if (!favourite || favourite.productPost.length === 0) {
    return next(new ApiError("No products found in your favourites", 404));
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        "Favourites fetched successfully",
        favourite.productPost,
        200
      )
    );
});

export const clearUserFavouriteList = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  let favourite = await Favourite.findOne({ userId });

  if (!favourite || favourite.productPost.length === 0) {
    return next(new ApiError("No products in favourites to clear", 404));
  }

  favourite.productPost = [];
  await favourite.save();

  return res
    .status(200)
    .json(new ApiResponse("Favourites cleared successfully", null, 200));
});
