import express from "express";
import { signup, login } from "../../controller/auth/authController.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
// router.route("/api_key").post(generateAccessToken);

export default router;
