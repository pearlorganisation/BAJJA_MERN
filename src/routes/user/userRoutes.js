import express from "express";
import {
  getUserProfile,
  updateUserProfile,
} from "../../controller/user/userController.js";
import { authenticateToken } from "../../middleware/authMiddleware.js";
import { upload } from "../../middleware/multer.js";

const router = express.Router();

router
  .route("/profile")
  .get(authenticateToken, getUserProfile)
  .patch(authenticateToken, upload.single("profilePic"), updateUserProfile);

export default router;
