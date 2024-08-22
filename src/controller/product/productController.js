import { uploadFileToCloudinary } from "../../configs/cloudinary.js";
import Product from "../../models/product/product.js";
import ApiError from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const createProductPost = async (req, res) => {
  try {
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
      return res.status(400).json({ message: "All fields are required." });
    }
    const minPriceNum = Number(minprice);
    const maxPriceNum = Number(maxprice);

    if (minPriceNum < 0 || maxPriceNum < 0) {
      return res
        .status(400)
        .json({ message: "Price must be a positive value." });
    }
    if (minPriceNum > maxPriceNum) {
      return res.status(400).json({
        message: "Minimum price cannot be greater than maximum price.",
      });
    }

    if (!photos || photos.length > 4) {
      return res
        .status(400)
        .json({ message: "You must upload between 1 and 4 photos." });
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
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

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


