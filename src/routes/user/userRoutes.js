import express from "express";
import { authenticateToken } from "../../middleware/authMiddleware.js";
import { upload } from "../../middleware/multer.js";
import {
  changePassword,
  deleteUser,
  forgotPassword,
  getSellerComments,
  getUserProfile,
  resetPassword,
  toggleUserRole,
  updateUserProfile,
} from "../../controller/user/userController.js";

const router = express.Router();

router
  .route("/profile")
  .get(authenticateToken, getUserProfile)
  .patch(authenticateToken, upload.single("profilePic"), updateUserProfile);

router.route("/change-password").post(authenticateToken, changePassword);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.route("/my-comments").get(authenticateToken, getSellerComments); //Only for seller
router.route("/:userId").delete(authenticateToken, deleteUser);
router.route("/toggle-role").post(authenticateToken, toggleUserRole);

export default router;
