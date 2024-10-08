import express from "express";
import {
  createComment,
  createProductPost,
  deleteProductPostById,
  getComments,
  getProductPostById,
  searchProductPost,
  updateProductPost,
} from "../../controller/product/productController.js";
import { upload } from "../../middleware/multer.js";
import {
  authenticateToken,
  verifyPermission,
} from "../../middleware/authMiddleware.js";
import { USER_ROLES_ENUM } from "../../../constants.js";

const router = express.Router();

router.route("/search").get(searchProductPost);
router
  .route("/")
  .post(
    authenticateToken,
    verifyPermission([USER_ROLES_ENUM.BUYER]),
    upload.array("photos"),
    createProductPost
  );

router
  .route("/:productPostId")
  .get(authenticateToken, getProductPostById)
  .patch(
    authenticateToken,
    verifyPermission([USER_ROLES_ENUM.BUYER]),
    upload.array("photos"),
    updateProductPost
  )
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

export default router;
