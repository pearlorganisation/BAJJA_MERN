import express from "express";
import {
  addToWishList,
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
    removeFromWishList
  );

export default router;
