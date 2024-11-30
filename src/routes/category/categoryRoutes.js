import express from "express";
import { authenticateToken } from "../../middleware/authMiddleware.js";
import {
  createCategory,
  getAllServicesCategories,
  getAllGoodsCategoryTree,
  insertCategory,
} from "../../controller/category/categoryController.js";

const router = express.Router();

router
  .route("/services")
  .post(authenticateToken, createCategory)
  .get(getAllServicesCategories);

// router
//   .route("/:categoryId")
//   .patch(authenticateToken, updateCategoryById) //gpt new
//   .delete(authenticateToken, deleteCategoryById);

router.route("/goods").post(insertCategory).get(getAllGoodsCategoryTree);

export default router;
