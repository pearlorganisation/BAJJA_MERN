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
      { senderId, receiverId }, //Whoever has initiate the chat is hitting the api to get chats - buyer
      { senderId: receiverId, receiverId: senderId }, //The person who didn't start the chat is now hitting the api to get all his chat with the receiver - [ seller ]
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

export const deleteChatRoomById = asyncHandler(async (req, res, next) => {
  const deletedChatRooom = await ChatRoom.findOneAndDelete({
    roomId: req.params?.roomId,
  });
  if (!deletedChatRooom || deletedChatRooom.length === 0) {
    return next(new ApiError("Chat room is not found.", 404));
  }
  return res
    .status(200)
    .json(new ApiResponse("Chat room is deleted", null, 200)); // you can send []
});

export const getChatUsers = asyncHandler(async (req, res, next) => {
  const loggedInUser = req.user._id; // logged in user can be any body - buyer or seller

  const chatRooms = await ChatRoom.find({
    $or: [{ receiverId: loggedInUser }, { senderId: loggedInUser }], //work for both buyer and seller
  });

  if (!chatRooms) {
    return next(new ApiError("No chat history found.", 404));
  }

  // Extract loggedIn user Id, user IDs and room IDs
  const chatData = chatRooms.map((room) => ({
    roomId: room.roomId, // Extracting roomId
    senderId: room.senderId.toString(),
    receiverId: room.receiverId.toString(),
  }));

  // Filter out userId whome loggedin user chatted with and get the room ID too.
  const chatUsers = chatData.map((data) => ({
    userId: loggedInUser === data.senderId ? data.receiverId : data.senderId,
    roomId: data.roomId,
  }));

  // Get details of users from the filtered chat user IDs
  const users = await User.find({
    _id: { $in: chatUsers.map((chatUser) => chatUser.userId) },
  })
    .select("profilePic _id username fcmToken")
    .lean();

  // Include roomId in the response alongside user details
  const usersWithRoomId = users.map((user) => ({
    ...user, //Convert Mongoose doc to plain object use [user.toObject() ]  or [ user.toJSON() ], No need to use Since lean already returns plain objects
    roomId: chatUsers.find(
      (chatUser) => chatUser.userId === user._id.toString()
    ).roomId,
  }));

  return res
    .status(200)
    .json(
      new ApiResponse(
        "List of users you have chatted with.",
        usersWithRoomId,
        200
      )
    );
});
