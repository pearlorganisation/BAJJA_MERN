import express from "express";
import { createPost } from "../../controller/product/productController.js";
import { upload } from "../../middleware/multer.js";
import { authenticateToken } from "../../middleware/authMiddleware.js";
const router = express.Router();

router
  .route("/postAdd")
  .post(authenticateToken, upload.array("photos"), createPost);

export default router;
