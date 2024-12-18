import express from "express";
import { authenticateToken } from "../../middleware/authMiddleware.js";
import {
  createCategory,
  deleteCategoryById,
  getAllCategories,
  updateCategoryById,
} from "../../controller/category/categoryController.js";

const router = express.Router();

router.route("/").post(authenticateToken, createCategory).get(getAllCategories);
router
  .route("/:categoryId")
  .patch(authenticateToken, updateCategoryById)
  .delete(authenticateToken, deleteCategoryById);

// router
//   .route("/services")
//   .post(authenticateToken, createCategory)
//   .get(getAllServicesCategories);
// router.route("/goods").post(insertCategory).get(getAllGoodsCategoryTree);

export default router;
