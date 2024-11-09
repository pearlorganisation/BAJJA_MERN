import express from "express";
import {
  createCategory,
  deleteCategoryById,
  getAllCategories,
  getCategoryTree,
  updateCategoryById,
} from "../../controller/category/categoryController.js";
import { authenticateToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(authenticateToken, createCategory).get(getAllCategories);
router.route("/tree").get(getCategoryTree);
router
  .route("/:categoryId")
  .patch(authenticateToken, updateCategoryById) //gpt new
  .delete(authenticateToken, deleteCategoryById);

export default router;
