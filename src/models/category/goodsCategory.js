import mongoose from "mongoose";

const goodsCategorySchema = new mongoose.Schema(
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
    type: String,
  },
  { timestamps: true }
);
const GoodsCategory = mongoose.model("GoodsCategory", goodsCategorySchema);

export default GoodsCategory;
