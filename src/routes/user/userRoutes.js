import express from "express";
import {
  changePassword,
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

router.route("/change-password").post(authenticateToken, changePassword);
export default router;
