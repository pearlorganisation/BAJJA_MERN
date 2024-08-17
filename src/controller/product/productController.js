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
  if (!productPostId) {
    return next(new ApiError("Product id is required", 400));
  }
  if (
    !product_name ||
    !type ||
    !category ||
    !sub_category ||
    !description ||
    !minprice ||
    !maxprice
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }
  const minPriceNum = Number(minprice);
  const maxPriceNum = Number(maxprice);
  if (minPriceNum < 0 || maxPriceNum < 0) {
    return res.status(400).json({ message: "Price must be a positive value." });
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
  const updateFields = {};
  const { _id } = req.user;
  updateFields.product_name = product_name;
  updateFields.category = category;
  updateFields.sub_category = sub_category;
  updateFields.description = description;
  updateFields.userId = _id;
  updateFields.minprice = minPriceNum;
  updateFields.maxprice = maxPriceNum;
  updateFields.photos = response.result;
  console.log("id ", _id);
  const updatedProduct = await Product.findByIdAndUpdate(
    productPostId,
    {
      $set: updateFields,
    },
    { $new: true }
  );
  if (!updatedProduct) {
    return next(new ApiError("Product is not updated", 400));
  }
  return res.status(200).json({
    success: true,
    message: "Product updated successfully.",
    product: updatedProduct,
  });
});
