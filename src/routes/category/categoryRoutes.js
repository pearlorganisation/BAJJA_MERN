import express from "express";
import {
  createCategory,
  getAllCategories,
} from "../../controller/category/categoryController.js";

const router = express.Router();

router.route("/").post(createCategory).get(getAllCategories);

export default router;
