import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    photos: {
      type: [], 
      validate: {
        validator: function (value) {
          return value.length <= 4; // Maximum 4 photos
        },
        message: "You can upload a maximum of 4 photos.",
      },
    },
    product_name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["good", "service"], // Assuming "type" can be either "good" or "service"
      default: "good",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    sub_category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    minprice: {
      type: Number,
      required: true,
    },
    maxprice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
