import express from "express";
import { getAllBuyerProductPosts } from "../../controller/home/homeController.js";
import { authenticateToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(authenticateToken, getAllBuyerProductPosts);

export default router;
