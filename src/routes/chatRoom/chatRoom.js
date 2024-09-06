import express from "express";
import { createChatRoom } from "../../controller/chatRoom/chatRoom.js";

const router = express.Router();

router.route("/").post(createChatRoom);

export default router;
