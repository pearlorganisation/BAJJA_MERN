import express from "express";
import {
  createChatRoom,
  getChatUsers,
} from "../../controller/chatRoom/chatRoom.js";
import { authenticateToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(authenticateToken, createChatRoom);
router.route("/get-chat-users").get(authenticateToken, getChatUsers);

export default router;
 