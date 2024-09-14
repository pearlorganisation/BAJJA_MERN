import express from "express";
import {
  deleteCommentById,
  updateCommentById,
} from "../../controller/comment/commentController.js";

const router = express.Router();

router.route("/:commentId").patch(updateCommentById).delete(deleteCommentById);

export default router;
