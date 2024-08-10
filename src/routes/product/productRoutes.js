import express from "express";
import { createPost } from "../../controller/product/productController.js";
import { upload } from "../../middleware/multer.js";
const router = express.Router();

router.route("/postAdd").post(upload.array("photos"), createPost);

export default router;
