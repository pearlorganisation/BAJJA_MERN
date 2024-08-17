import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Sub Category name is required"],
    },
    category_id: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: [true, "Category id is reqiuired"],
    },
  },
  { timestamps: true }
);

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

export default SubCategory;
