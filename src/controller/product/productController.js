import { uploadFileToCloudinary } from "../../configs/cloudinary.js";
import Product from "../../models/product/product.js";

export const createPost = async (req, res) => {
  try {
    const {
      product_name,
      type,
      category,
      sub_category,
      description,
      minprice,
      maxprice,
      userId,
    } = req.body;
    const photos = req.files;
    if (
      !product_name ||
      !type ||
      !category ||
      !sub_category ||
      !description ||
      !minprice ||
      !maxprice ||
      !userId
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const minPriceNum = Number(minprice);
    const maxPriceNum = Number(maxprice);
    const userIdNum = Number(userId);

    if (minPriceNum < 0 || maxPriceNum < 0) {
      return res
        .status(400)
        .json({ message: "Price must be a positive value." });
    }
    if (minPriceNum > maxPriceNum) {
      return res.status(400).json({
        message: "Minimum price cannot be greater than maximum price.",
      });
    }

    if (!photos || photos.length > 4) {
      return res
        .status(400)
        .json({ message: "You must upload between 1 and 4 photos." });
    }
    const response = await uploadFileToCloudinary(photos);
    //console.log("Reponse:  ", response);

    const product = new Product({
      product_name,
      type,
      category,
      sub_category,
      description,
      minprice: minPriceNum,
      maxprice: maxPriceNum,
      photos: response.result,
      userId,
    });

    // Save the product to the database
    await product.save();

    // Respond with the created product
    return res.status(201).json({
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};
