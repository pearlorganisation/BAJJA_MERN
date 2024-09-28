import express from "express";
import {
  clearUserFavouriteList,
  getUserFavouriteList,
  toggleFavouriteList,
} from "../../controller/favourite/favouriteController.js";
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
    toggleFavouriteList
  )
  .get(
    authenticateToken,
    verifyPermission([USER_ROLES_ENUM.SELLER]),
    getUserFavouriteList
  );

// Route to clear the wishlist of logged in user
router
  .route("/clear")
  .delete(
    authenticateToken,
    verifyPermission([USER_ROLES_ENUM.SELLER]),
    clearUserFavouriteList
  );

export default router;
