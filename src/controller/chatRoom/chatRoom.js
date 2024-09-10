import { v4 as uuidv4 } from "uuid";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import ChatRoom from "../../models/chatRoom/chatRoom.js";
import User from "../../models/user/user.js";
import ApiError from "../../utils/ApiError.js";

export const createChatRoom = asyncHandler(async (req, res, next) => {
  const { senderId, receiverId } = req.body;

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

export const getChatUsers = asyncHandler(async (req, res, next) => {
  const loggedInUser = req.user._id;
  const chatRooms = await ChatRoom.find({
    $or: [{ receiverId: loggedInUser }, { senderId: loggedInUser }],
  });
  if (!chatRooms || chatRooms.length === 0) {
    return next(new ApiError("No chat history found.", 404));
  }
  const userIds = chatRooms.flatMap((room) => [
    room.senderId.toString(),
    room.receiverId.toString(),
  ]);
  // console.log(userIds);
  const chatUsers = userIds.filter((userId) => loggedInUser !== userId);
  // console.log(chatUsers);
  const users = await User.find({ _id: { $in: chatUsers } }).select(
    "profilePic _id username"
  );
  return res
    .status(200)
    .json(new ApiResponse("List of users you have chatted with.", users, 200));
});
