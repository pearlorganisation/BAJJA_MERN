// import SubCategory from "../../models/subCategory/subCategory.js";
// import { asyncHandler } from "../../utils/asyncHandler.js";
// import ApiError from "../../utils/ApiError.js";

// export const createSubCategory = asyncHandler(async (req, res, next) => {
//   const { name, category_id } = req.body;
//   if (!name || !category_id) {
//     return next(new ApiError("All fields are required", 400));
//   }
//   const subCategory = await SubCategory.create(req.body);
//   if (!subCategory) {
//     return next(new ApiError("Sub category not created", 400));
//   }
//   return res.status(201).json({
//     success: true,
//     message: "Sub category is created",
//     data: subCategory,
//   });
// });

// export const getAllSubCategories = asyncHandler(async (req, res, next) => {});
