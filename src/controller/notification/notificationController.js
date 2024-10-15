import { sendNotificationToSelectedDevice } from "../../services/notificationService.js";
import ApiError from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const sendNotification = asyncHandler(async (req, res, next) => {
  const { deviceFCMToken, notiTitle, notiBody, customData } = req.body;

  if (!deviceFCMToken || !notiTitle || !notiBody) {
    return next(new ApiError("All fields are required", 400));
  }

  try {
    const response = await sendNotificationToSelectedDevice(
      deviceFCMToken,
      notiTitle,
      notiBody,
      customData
    );

    if (response.status === 200) {
      return res
        .status(200)
        .json(
          new ApiResponse("Notification sent successfully", response.data, 200)
        );
    } else {
      return next(new ApiError("Failed to send notification", response.status));
    }
  } catch (error) {
    next(new ApiError(`Error sending notification: ${error.message}`, 500));
  }
});
