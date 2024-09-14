import Comment from "../../models/comment/comment.js";
import ApiError from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const updateCommentById = asyncHandler(async (req, res, next) => {
  const { content } = req.body;
  if (!content) {
    return next(new ApiError("Content cannot be undefined", 400));
  }
  const updatedComment = await Comment.findByIdAndUpdate(
    req.params?.commentId,
    {
      $set: { content },
    },
    { new: true, runValidators: true }
  );
  console.log(updatedComment);
  if (!updatedComment) {
    return next(new ApiError("Comment is not updated", 400));
  }
  return res
    .status(200)
    .json(new ApiResponse("Comment is updated", updatedComment, 200));
});

export const deleteCommentById = asyncHandler(async (req, res, next) => {
  const deletedComment = await Comment.findByIdAndDelete(req.params?.commentId); // Return null if doc not found, if found return deleted doc
  if (!deletedComment) {
    return next(new ApiError("Comment not found", 404));
  }
  return res.status(200).json(new ApiResponse("Comment is deleted", null, 200));
});
