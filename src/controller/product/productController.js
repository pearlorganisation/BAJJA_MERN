import { uploadFileToCloudinary } from "../../configs/cloudinary.js";
import Comment from "../../models/comment/comment.js";
import Product from "../../models/product/product.js";
import ApiError from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const createProductPost = asyncHandler(async (req, res) => {
  const {
    product_name,
    type,
    category,
    sub_category,
    description,
    minprice,
    maxprice,
  } = req.body;
  const photos = req.files;
  console.log(photos);
  if (
    !product_name ||
    !type ||
    !category ||
    !sub_category ||
    !description ||
    !minprice ||
    !maxprice ||
    photos.length === 0
  ) {
    return next(new ApiError("All fields are required", 400));
  }
  const minPriceNum = Number(minprice);
  const maxPriceNum = Number(maxprice);

  if (minPriceNum < 0 || maxPriceNum < 0) {
    return next(new ApiError("Price must be a positive value.", 400));
  }
  if (minPriceNum > maxPriceNum) {
    return next(
      new ApiError("Minimum price cannot be greater than maximum price.", 400)
    );
  }

  if (!photos || photos.length > 4) {
    return next(new ApiError("You must upload between 1 and 4 photos.", 400));
  }
  const response = await uploadFileToCloudinary(photos);
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
  });
  await product.save();
  return res.status(201).json({
    message: "Product created successfully.",
    product,
  });
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

export const deleteProductPost = asyncHandler(async (req, res, next) => {
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
    "profilePic username"
  );

  if (comments.length === 0) {
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
