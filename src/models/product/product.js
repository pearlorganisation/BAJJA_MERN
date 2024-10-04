import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
    },
    product_name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Goods", "Services"],
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
    photos: {
      type: [],
      validate: {
        validator: function (value) {
          return value.length <= 4; // Maximum 4 photos
        },
        message: "You can upload a maximum of 4 photos.",
      },
      required: [true, "Photos are required"],
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
    city: {
      type: String,
      required: [true, "City is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    zipcode: {
      type: String,
      required: [true, "Zipcode is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
