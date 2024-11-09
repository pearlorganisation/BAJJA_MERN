import Category from "../../models/category/category.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

// export const createCategory = asyncHandler(async (req, res, next) => {
//   const category = await Category.create(req.body);
//   if (!category) {
//     return next(new ApiError("Category not created", 400));
//   }
//   return res.status(201).json({
//     success: true,
//     message: "Category is created",
//     data: category,
//   });
// });

// export const getAllCategories = asyncHandler(async (req, res, next) => {
//   const { type } = req.query;
//   const query = type ? { type } : {};

//   const message = type
//     ? "No categories found for the given type."
//     : "No categories available.";
//   const categories = await Category.find(query);

//   if (!categories || categories.length === 0) {
//     return next(new ApiError(message, 400));
//   }
//   return res.status(200).json({
//     success: true,
//     message: "All categories are found",
//     data: categories,
//   });
// });

// export const updateCategoryById = asyncHandler(async (req, res, next) => {
//   const { categoryId } = req.params;
//   const category = await Category.findById(categoryId);

//   if (!category) {
//     return next(new ApiResponse("Category not found", 404));
//   }

//   const { name, type, sub_categories } = req.body;

//   // Validate category type
//   if (type && !["Goods", "Services"].includes(type)) {
//     return next(new ApiResponse("Invalid category type", 400));
//   }

//  //Update subcategory by _id, or if no _id provided then create new subcategory || [ Update and Create ] together
//   if (sub_categories) {
//     sub_categories.forEach((subCategory) => {
//       const existingSubCategory = category.sub_categories.find(
//         (item) => item._id?.toString() === subCategory._id
//       );
//       if (existingSubCategory) {
//         // Update the existing subcategory if it exists
//         existingSubCategory.name = subCategory.name;
//       } else {
//         // Add a new subcategory if it doesn't exist
//         category.sub_categories.push(subCategory);
//       }
//     });
//   }

//   // Update other fields like name and type
//   if (name) category.name = name;
//   if (type) category.type = type;

//   // Save the updated category
//   const updatedCategory = await category.save();

//   res.status(200).json({
//     success: true,
//     data: updatedCategory,
//   });
// });

// export const deleteCategoryById = asyncHandler(async (req, res, next) => {
//   const deletedCategory = await Category.findByIdAndDelete(
//     req.params?.categoryId
//   ); // Return null if doc not found, if found return deleted doc
//   if (!deletedCategory) {
//     return next(new ApiError("Category not found", 404));
//   }
//   return res
//     .status(200)
//     .json(new ApiResponse("Category is deleted", null, 200));
// });

// Recursive function to build category tree
const buildCategoryTree = async (parentId = null) => {
  const categories = await Category.find({ parent: parentId }).lean();

  for (let category of categories) {
    category.subcategories = await buildCategoryTree(category._id);
  }

  return categories;
};

export const createCategory = async (req, res) => {
  const { name, slug, parent } = req.body;

  try {
    const category = new Category({ name, slug, parent });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCategoryTree = async (req, res) => {
  try {
    const categoryTree = await buildCategoryTree();
    res.json(categoryTree);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
