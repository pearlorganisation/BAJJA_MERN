import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/\S+@\S+\.\S+/, "is invalid"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    phoneNumber: {
      type: String,
      match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number"],
    },
    useRole: {
      type: String,
      enum: ["buyer", "seller"],
      default: "buyer",
    },
  },
  { timeStamps: true }
);

export default mongoose.model("User", userSchema);
