import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subcategory name is required"],
    },
  },
  { _id: true }
);
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: [true, "Category name must be unique"],
    },
    type: {
      type: String,
      enum: ["Goods", "Services"],
      required: [true, "Category type is required"],
    },
    sub_categories: [subCategorySchema],
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
