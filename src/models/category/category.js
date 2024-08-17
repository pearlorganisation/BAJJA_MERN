import mongoose from "mongoose";


const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
    },
    sub_category: [
      {
        type: mongoose.Types.ObjectId,
        ref: "SubCategory",
        required: [true, "Sub Category id is reqiuired"],
      },
    ],
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
