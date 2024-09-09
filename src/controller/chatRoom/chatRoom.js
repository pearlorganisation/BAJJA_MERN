import { v4 as uuidv4 } from "uuid";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import ChatRoom from "../../models/chatRoom/chatRoom.js";

export const createChatRoom = asyncHandler(async (req, res, next) => {
  const { senderId, receiverId } = req.body;

  //Check if chat room already exists
  const existingChatRoom = await ChatRoom.findOne({
    $or: [
      { senderId, receiverId }, //Whoever has initiate the chat is hitting the api to get chats
      { senderId: receiverId, receiverId: senderId }, //The person who didn't start the chat is now hitting the api to get all his chat with the receiver
    ],
  });
  if (existingChatRoom) {
    return res.status(200).json(
      new ApiResponse(
        "Char room already exists.",
        {
          roomId: existingChatRoom.roomId,
        },
        200
      )
    );
  }
  const roomId = uuidv4();
  const newRoom = await ChatRoom.create({ ...req.body, roomId });
  return res
    .status(201)
    .json(new ApiResponse("Chat room created.", newRoom, 201));
});
