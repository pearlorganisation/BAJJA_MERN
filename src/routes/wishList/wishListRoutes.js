import express from "express";
import {
  addToWishList,
  clearWishList,
  getUserWishList,
  removeFromWishList,
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
    addToWishList
  )
  .get(
    authenticateToken,
    verifyPermission([USER_ROLES_ENUM.SELLER]),
    getUserWishList
  )
  .delete(
    authenticateToken,
    verifyPermission([USER_ROLES_ENUM.SELLER]),
    removeFromWishList // Route to remove a particular product from wishlist
  );

// Route to clear the wishlist for logged in user
router
  .route("/clear")
  .delete(
    authenticateToken,
    verifyPermission([USER_ROLES_ENUM.SELLER]),
    clearWishList
  );

export default router;
