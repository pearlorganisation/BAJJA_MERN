import Category from "../../models/category/category.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import Category2 from "../../models/category/category.js";
import fs from "fs";
import path from "path";

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
const buildCategoryTree = (
  categories,
  parentId = null,
  depth = 0,
  maxDepth = 50
) => {
  if (depth > maxDepth) {
    console.warn(`Max depth reached at parentId: ${parentId}`);
    return [];
  }

  return categories
    .filter((category) => category.parent_id === parentId)
    .map((category) => ({
      id: category.id,
      name: category.name,
      path: category.path,
      children: buildCategoryTree(categories, category.id, depth + 1, maxDepth), // Recursive call
    }));
};

export const getCategoryTree = async (req, res) => {
  try {
    // Fetch all categories from the database
    const categories = await Category.find().lean(); // .lean() for better performance

    // Transform the flat list into a nested tree
    // const categoryTree = buildCategoryTree(categories);

    // Send the response
    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

export const insertCategory = async (req, res) => {
  try {
    // Read the JSON file
    const data = fs.readFileSync("categories.json", "utf8");
    const categories = JSON.parse(data); // Parse the JSON data

    // Insert the data
    await Category2.insertMany(categories);
    res.status(200).json({ success: true });
    console.log("Categories inserted successfully!");
  } catch (error) {
    console.error("Error inserting categories:", error);
  }
};
