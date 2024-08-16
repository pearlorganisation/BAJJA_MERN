import express from "express";
import {
  createProductPost,
  updateProductPost,
} from "../../controller/product/productController.js";
import { upload } from "../../middleware/multer.js";
import { authenticateToken } from "../../middleware/authMiddleware.js";
const router = express.Router();

router
  .route("/")
  .post(authenticateToken, upload.array("photos"), createProductPost);

router
  .route("/:productPostId")
  .patch(authenticateToken, upload.array("photos"), updateProductPost);

export default router;
