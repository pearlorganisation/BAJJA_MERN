import express from "express";
import {
  deleteCommentById,
  updateCommentById,
} from "../../controller/comment/commentController.js";
import {
  authenticateToken,
  verifyPermission,
} from "../../middleware/authMiddleware.js";
import { USER_ROLES_ENUM } from "../../../constants.js";

const router = express.Router();

router
  .route("/:commentId")
  .patch(
    authenticateToken,
    verifyPermission([USER_ROLES_ENUM.SELLER]),
    updateCommentById
  )
  .delete(
    authenticateToken,
    verifyPermission([USER_ROLES_ENUM.SELLER]),
    deleteCommentById
  );

export default router;
