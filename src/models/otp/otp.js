import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create TTL index
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 }); // Delete doc automatically after 5 min, if user not calling reset-password api

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;
