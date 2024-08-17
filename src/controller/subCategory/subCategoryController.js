import SubCategory from "../../models/subCategory/subCategory";
import { asyncHandler } from "../../utils/asyncHandler";

export const createSubCategory = asyncHandler(async (req, res, next) => {
  const { name, category_id } = req.body;
  if (!name || !category_id) {
    return next(new ApiError());
  }
  const subCategory = SubCategory.create(req.body);
});

export const getAllSubCategories = asyncHandler(async (req, res, next) => {});
