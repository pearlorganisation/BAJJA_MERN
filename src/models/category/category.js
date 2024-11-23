import mongoose from "mongoose";

// const subCategorySchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Subcategory name is required"],
//     },
//   },
//   { _id: true }
// );
// const categorySchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Category name is required"],
//       unique: [true, "Category name must be unique"],
//     },
//     type: {
//       type: String,
//       enum: ["Goods", "Services"],
//       required: [true, "Category type is required"],
//     },
//     sub_categories: [subCategorySchema],
//   },
//   { timestamps: true }
// );
const category2Schema = new mongoose.Schema(
  {
    gptId: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    parent_id: {
      type: Number,
      default: null, // Top-level categories have no parent
    },
    path: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Category2 = mongoose.model("Category2", category2Schema);

export default Category2;
