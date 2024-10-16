import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "../../configs/cloudinary.js";
import Comment from "../../models/comment/comment.js";
import Product from "../../models/product/product.js";
import ApiError from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const createProductPost = asyncHandler(async (req, res, next) => {
  const {
    product_name,
    type,
    category,
    sub_category,
    description,
    minprice,
    maxprice,
    city,
    state,
    zipcode,
  } = req.body;
  const photos = req.files;

  // Validate that all required fields are provided
  if (
    !product_name ||
    !type ||
    !category ||
    !sub_category ||
    !description ||
    !minprice ||
    !maxprice ||
    !city ||
    !state ||
    !zipcode ||
    photos.length === 0
  ) {
    return next(new ApiError("All fields are required", 400));
  }

  const minPriceNum = Number(minprice);
  const maxPriceNum = Number(maxprice);

  // Validate price values
  if (minPriceNum < 0 || maxPriceNum < 0) {
    return next(new ApiError("Price must be a positive value.", 400));
  }
  if (minPriceNum > maxPriceNum) {
    return next(
      new ApiError("Minimum price cannot be greater than maximum price.", 400)
    );
  }

  // Validate photo uploads
  if (!photos || photos.length > 4) {
    return next(new ApiError("You must upload between 1 and 4 photos.", 400));
  }

  // Upload photos to Cloudinary
  const response = await uploadFileToCloudinary(photos);

  // Create a new product with the new fields included
  const product = new Product({
    product_name,
    type,
    category,
    sub_category,
    description,
    minprice: minPriceNum,
    maxprice: maxPriceNum,
    photos: response.result,
    userId: req.user?._id,
    city,
    state,
    zipcode,
  });

  // Save the product to the database
  await product.save();

  // Respond with success message and product data
  return res.status(201).json({
    message: "Product created successfully.",
    product,
  });
});

export const getProductPostById = asyncHandler(async (req, res, next) => {
  const { productPostId } = req.params;
  const productPost = await Product.findById(productPostId).populate(
    "userId",
    "fcmToken username userRole"
  );
  if (!productPost) {
    return next(new ApiError("Product post not found", 404));
  }
  return res
    .status(200)
    .json(new ApiResponse("Product post found", productPost, 200));
});

export const updateProductPost = asyncHandler(async (req, res, next) => {
  const { productPostId } = req.params;
  const { minprice, maxprice, ...rest } = req.body;
  const photos = req.files;

  if (!productPostId) {
    return next(new ApiError("Product ID is required", 400));
  }

  const updateFields = { ...rest };

  // Handle minprice validation and update
  if (minprice !== undefined) {
    const minPriceNum = Number(minprice);
    if (isNaN(minPriceNum) || minPriceNum < 0) {
      return next(new ApiError("Minimum price must be a positive value.", 400));
    }
    updateFields.minprice = minPriceNum;
  }

  // Handle maxprice validation and update
  if (maxprice !== undefined) {
    const maxPriceNum = Number(maxprice);
    if (isNaN(maxPriceNum) || maxPriceNum < 0) {
      return next(new ApiError("Maximum price must be a positive value.", 400));
    }
    updateFields.maxprice = maxPriceNum;
  }

  // Ensure minprice is not greater than maxprice
  if (minprice && maxprice && Number(minprice) > Number(maxprice)) {
    return next(
      new ApiError("Minimum price cannot be greater than maximum price.", 400)
    );
  }

  // Handle photos validation and update
  if (photos && photos.length > 0) {
    if (photos.length > 4) {
      return next(new ApiError("You must upload between 1 and 4 photos.", 400));
    }
    const response = await uploadFileToCloudinary(photos);
    updateFields.photos = response.result;
  }

  // Always update the userId
  updateFields.userId = req.user._id;
  const updatedProduct = await Product.findByIdAndUpdate(
    productPostId,
    { $set: updateFields },
    { new: true }
  );

  if (!updatedProduct) {
    return next(new ApiError("Product not found or update failed", 400));
  }

  return res.status(200).json({
    success: true,
    message: "Product updated successfully.",
    product: updatedProduct,
  });
});

export const deleteProductPostById = asyncHandler(async (req, res, next) => {
  const { productPostId } = req.params;
  let productPost = await Product.findById(productPostId);
  if (!productPost) {
    return next(
      new ApiError(`Product post not found with id of ${productPostId}`, 404)
    );
  }
  if (req.user?._id !== productPost.userId.toString()) {
    return next(
      new ApiError("Not authorized to delete this product post", 401)
    );
  }

  console.log("photos: ", productPost.photos);
  // Delete uploaded photos from Cloudinary
  if (productPost.photos && productPost.photos.length > 0) {
    await deleteFileFromCloudinary(productPost.photos);
  }

  await Product.deleteOne({ _id: productPostId });
  return res
    .status(200)
    .json({ success: true, message: "Product post deleted successfully" });
});

export const createComment = asyncHandler(async (req, res, next) => {
  const { content } = req.body;
  const { productPostId } = req.params;
  const product = await Product.findById(productPostId);
  const comment = await Comment.create({
    content,
    userId: req.user._id,
    productPostId,
  });

  res.status(201).json({
    success: true,
    message: "Comment added successfully",
    data: comment,
  });
});

export const getComments = asyncHandler(async (req, res, next) => {
  const { productPostId } = req.params;
  const product = await Product.findById(productPostId);
  if (!product) {
    return next(new ApiError("Product not found", 404));
  }
  const comments = await Comment.find({ productPostId }).populate(
    "userId",
    "profilePic username fcmToken"
  );

  if (!comments || comments.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No comments found for this product post",
    });
  }
  res.status(200).json({
    success: true,
    data: comments,
  });
});

export const searchProductPost = asyncHandler(async (req, res, next) => {
  const { productName } = req.query;

  // Check if productName is provided
  if (!productName) {
    return next(new ApiError("Product name is required for search", 400));
  }

  // Perform a case-insensitive search on product_name
  const products = await Product.find({
    product_name: { $regex: productName, $options: "i" },
  }); //.select("product_name category sub_category");

  // If no products are found
  if (products.length === 0) {
    return next(
      new ApiError("No products found matching the provided name", 404)
    );
  }

  return res.status(200).json(new ApiResponse("Products found", products, 200));
});
