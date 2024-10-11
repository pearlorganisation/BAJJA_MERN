import express from "express";
import { sendNotification } from "../../controller/notification/notificationController.js";

const router = express.Router();

// POST /api/send-notification
router.route("/send-notification").post(sendNotification);

export default router;
