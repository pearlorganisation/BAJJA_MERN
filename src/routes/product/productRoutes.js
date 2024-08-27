import express from "express";
import {
  createComment,
  createProductPost,
  deleteProductPost,
  getComments,
  updateProductPost,
} from "../../controller/product/productController.js";
import { upload } from "../../middleware/multer.js";
import {
  authenticateToken,
  verifyPermission,
} from "../../middleware/authMiddleware.js";
import { AVAILABLE_USER_ROLES, USER_ROLES_ENUM } from "../../../constants.js";
const router = express.Router();

router
  .route("/")
  .post(authenticateToken, upload.array("photos"), createProductPost);

router
  .route("/:productPostId")
  .patch(authenticateToken, upload.array("photos"), updateProductPost)
  .delete(
    authenticateToken,
    verifyPermission([USER_ROLES_ENUM.BUYER]),
    deleteProductPost
  );

router
  .route("/:productPostId/comments")
  .post(
    authenticateToken,
    verifyPermission([USER_ROLES_ENUM.SELLER]),
    createComment
  )
  .get(getComments);

export default router;
