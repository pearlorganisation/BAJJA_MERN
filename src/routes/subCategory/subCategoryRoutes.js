import express from "express";
import {
  createSubCategory,
  getAllSubCategories,
} from "../../controller/subCategory/subCategoryController";

const router = express.Router();

router.route("/").post(createSubCategory).get(getAllSubCategories);

export default router;
