import express from "express";
import {
  changePassword,
  forgotPassword,
  getSellerComments,
  getUserProfile,
  resetPassword,
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
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.route("/my-comments").get(authenticateToken, getSellerComments); //Only for seller

export default router;
