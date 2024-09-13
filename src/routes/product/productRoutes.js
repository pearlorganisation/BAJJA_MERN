import express from "express";
import {
  createComment,
  createProductPost,
  deleteProductPostById,
  getComments,
  getProductPostById,
  updateProductPost,
} from "../../controller/product/productController.js";
import { upload } from "../../middleware/multer.js";
import {
  authenticateToken,
  verifyPermission,
} from "../../middleware/authMiddleware.js";
import { USER_ROLES_ENUM } from "../../../constants.js";
const router = express.Router();

router
  .route("/")
  .post(authenticateToken, upload.array("photos"), createProductPost);

router
  .route("/:productPostId")
  .get(authenticateToken, getProductPostById)
  .patch(authenticateToken, upload.array("photos"), updateProductPost)
  .delete(
    authenticateToken,
    verifyPermission([USER_ROLES_ENUM.BUYER]),
    deleteProductPostById
  );

router
  .route("/:productPostId/comments")
  .post(
    authenticateToken,
    verifyPermission([USER_ROLES_ENUM.SELLER]),
    createComment
  )
  .get(authenticateToken, getComments);

//comment update and delete

export default router;
