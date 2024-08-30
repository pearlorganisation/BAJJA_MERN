import express from "express";
import { getAllProductPosts } from "../../controller/home/homeController.js";
import { authenticateToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(authenticateToken, getAllProductPosts);

export default router;
