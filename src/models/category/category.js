import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Sub Category name is required"],
    },
    category_id: { type: mongoose.Types.ObjectId },
  },
  { timestamps: true }
);
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
    },
    sub_category: [subCategorySchema],
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
