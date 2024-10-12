// import { sendNotificationToSelectedDevice } from "../../services/notificationService.js";
import admin from "firebase-admin";

// export const sendNotification = async (req, res) => {
//   const { deviceToken, title, body, customData } = req.body;

//   if (!deviceToken || !title || !body) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }

//   try {
//     await sendNotificationToSelectedDevice(
//       deviceToken,
//       title,
//       body,
//       customData
//     );
//     res.status(200).json({ message: "Notification sent successfully!" });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to send notification" });
//   }
// };

export const sendNotification = async (req, res) => {
  const { token, message, title } = req.body;

  if (!token || !message) {
    return res.status(400).json({ error: "Token and message are required" });
  }

  // sendNotification(token, message);
  // Notification sending function
  try {
    (function sendNotification() {
      const payload = {
        token,
        notification: {
          title,
          body: message,
        },
      };

      admin
        .messaging()
        .send(payload)
        .then((response) => {
          console.log("Notification sent successfully:", response);
        })
        .catch((error) => {
          console.error("Error sending notification:", error);
        });
    })();
  } catch (error) {
    throw new Error(error.message);
  }
  res.status(200).json({ success: true, message: "Notification sent" });
};
