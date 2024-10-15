import { getAccessToken } from "../configs/firebaseConfig.js";
import axios from "axios";

// Function to send notification
export async function sendNotificationToSelectedDevice(
  deviceToken,
  notiTitle,
  notiBody,
  customData = null
) {
  try {
    // Get access token from Firebase configuration
    const accessToken = await getAccessToken();

    const apiUrl =
      "https://fcm.googleapis.com/v1/projects/gogoa-4d569/messages:send";

    // Constructing the notification body
    const messageBody = {
      message: {
        token: deviceToken,
        notification: {
          title: notiTitle,
          body: notiBody,
        },
        ...(customData && { data: customData }), // Include custom data if provided
      },
    };

    // Sending the notification request to FCM
    const response = await axios.post(apiUrl, messageBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Logging success
    console.log(
      `Notification sent! Status code: ${response.status}, Message ID: ${response.data.name}`
    );

    // Return only necessary data in the response
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    // Handling error responses from FCM
    if (error.response) {
      console.error("Error response from FCM:", {
        status: error.response.status,
        data: error.response.data,
      });

      // Throwing more detailed error message
      throw new Error(
        `FCM Error: ${error.response.data.error.message || "Unknown error"}`
      );
    } else if (error.request) {
      // Network or request issue
      console.error("Network error or no response received:", error.message);
      throw new Error("Network error: Failed to send notification.");
    } else {
      // Other unknown errors
      console.error("Unexpected error:", error.message);
      throw new Error("Unexpected error occurred, please try again later.");
    }
  }
}
