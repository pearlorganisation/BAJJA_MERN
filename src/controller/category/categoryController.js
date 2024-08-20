import Category from "../../models/category/category.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";

export const createCategory = asyncHandler(async (req, res, next) => {
  const { name, sub_categories } = req.body;
  // console.log(sub_categories);
  if (!name || !sub_categories) {
    return next(new ApiError("All fields are required", 400));
  }
  const category = await Category.create(req.body);
  if (!category) {
    return next(new ApiError("Category not created", 400));
  }
  return res.status(201).json({
    success: true,
    message: "Category is created",
    data: category,
  });
});

export const getAllCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();
  if (!categories) {
    return next(new ApiError("Categories not found", 400));
  }
  return res
    .status(200)
    .json({
      success: true,
      message: "All categories are found",
      data: categories,
    });
});
