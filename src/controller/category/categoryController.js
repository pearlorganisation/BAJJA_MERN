import Category from "../../models/category/category.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const createCategory = asyncHandler(async (req, res, next) => {});

export const getAllCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();
});
