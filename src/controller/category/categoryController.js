import Category from "../../models/category/category.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";

export const createCategory = asyncHandler(async (req, res, next) => {
  const { name, type, sub_categories } = req.body;
  // console.log(sub_categories);
  // if (!name || !type || !sub_categories) {
  //   return next(new ApiError("All fields are required", 400));
  // }
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
  const { type } = req.query;
  const query = type ? { type } : {};

  const message = type
    ? "No categories found for the given type."
    : "No categories available.";
  const categories = await Category.find(query);

  if (!categories || categories.length === 0) {
    return next(new ApiError(message, 400));
  }
  return res.status(200).json({
    success: true,
    message: "All categories are found",
    data: categories,
  });
});
