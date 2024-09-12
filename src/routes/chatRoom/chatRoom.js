import express from "express";
import {
  createChatRoom,
  deleteChatRoomById,
  getChatUsers,
} from "../../controller/chatRoom/chatRoom.js";
import { authenticateToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(authenticateToken, createChatRoom);
router.route("/:roomId").delete(authenticateToken, deleteChatRoomById);
router.route("/get-chat-users").get(authenticateToken, getChatUsers); //Get user list whom i chatted with both for byuer and seller

export default router;
