const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    photos: {
      type: [String], // Assuming you are storing URLs or file paths as strings
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
      min: 0,
    },
    maxprice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
