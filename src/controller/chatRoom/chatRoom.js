import { v4 as uuidv4 } from "uuid";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import ChatRoom from "../../models/chatRoom/chatRoom.js";

export const createChatRoom = asyncHandler(async (req, res, next) => {
  const roomId = uuidv4();
  const newRoom = await ChatRoom.create({ ...req.body, roomId });
  return res
    .status(201)
    .json(new ApiResponse("Chat room created.", newRoom, 201));
});
