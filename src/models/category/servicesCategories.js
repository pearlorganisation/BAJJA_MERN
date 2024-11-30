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
const servicesCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: [true, "Category name must be unique"],
    },
    type: {
      type: String,
    },
    sub_categories: [subCategorySchema],
  },
  { timestamps: true }
);

const ServicesCategory = mongoose.model(
  "ServicesCategory",
  servicesCategorySchema
);

export default ServicesCategory;
