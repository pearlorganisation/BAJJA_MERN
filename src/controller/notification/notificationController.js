import { sendNotificationToSelectedDevice } from "../../services/notificationService.js";

export const sendNotification = async (req, res) => {
  const { deviceToken, title, body, customData } = req.body;

  if (!deviceToken || !title || !body) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await sendNotificationToSelectedDevice(
      deviceToken,
      title,
      body,
      customData
    );
    res.status(200).json({ message: "Notification sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send notification" });
  }
};        
