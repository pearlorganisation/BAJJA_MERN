import express from "express";
import { signup, login, logout } from "../../controller/auth/authController.js";
import { authenticateToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(authenticateToken, logout);

export default router;
