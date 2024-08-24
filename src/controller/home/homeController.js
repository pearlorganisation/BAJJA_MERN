import Product from "../../models/product/product.js";

export const getAllBuyerProductPosts = async (req, res) => {
  try {
    const userRole = req.user.role;
    if (userRole !== "buyer") {
      return res.status(403).json({
        message: "Access denied. Only buyers can access this endpoint.",
      });
    }
    const userId = req.user._id;
    const productPosts = await Product.find({ userId }).sort({
      createdAt: -1,
      updatedAt: -1,
    });

    res.status(200).json({
      success: true,
      message: "All product post found",
      data: productPosts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};
