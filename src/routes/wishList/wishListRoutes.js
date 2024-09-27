import express from "express";
import {
  clearUserWishList,
  getUserWishList,
  toggleWishList,
} from "../../controller/wishList/wishListController.js";
import {
  authenticateToken,
  verifyPermission,
} from "../../middleware/authMiddleware.js";
import { USER_ROLES_ENUM } from "../../../constants.js";

const router = express.Router();

router
  .route("/")
  .post(
    authenticateToken,
    verifyPermission([USER_ROLES_ENUM.SELLER]),
    toggleWishList
  )
  .get(
    authenticateToken,
    verifyPermission([USER_ROLES_ENUM.SELLER]),
    getUserWishList
  );

// Route to clear the wishlist of logged in user
router
  .route("/clear")
  .delete(
    authenticateToken,
    verifyPermission([USER_ROLES_ENUM.SELLER]),
    clearUserWishList
  );

export default router;
