import express from "express";
import { getUserProfile } from "../../controller/user/userController.js";
import { authenticateToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.route("/profile").get(authenticateToken, getUserProfile);

export default router;
