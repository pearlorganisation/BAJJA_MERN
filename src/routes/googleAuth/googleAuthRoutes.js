import express from "express";
import { googleAuth } from "../../controller/googleAuth/googleAuthController.js";

const router = express.Router();

router.route("/").post(googleAuth);

export default router;
