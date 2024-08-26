import express from "express";
import {
  createProductPost,
  deleteProductPost,
  updateProductPost,
} from "../../controller/product/productController.js";
import { upload } from "../../middleware/multer.js";
import {
  authenticateToken,
  verifyPermission,
} from "../../middleware/authMiddleware.js";
import { AVAILABLE_USER_ROLES } from "../../../constants.js";
const router = express.Router();

router
  .route("/")
  .post(authenticateToken, upload.array("photos"), createProductPost);

router
  .route("/:productPostId")
  .patch(authenticateToken, upload.array("photos"), updateProductPost)
  .delete(
    authenticateToken,
    verifyPermission(AVAILABLE_USER_ROLES),
    deleteProductPost
  );

export default router;
