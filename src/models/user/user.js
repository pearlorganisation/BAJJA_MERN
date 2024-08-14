import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      default: null,
    },
    fid: {
      type: String,
      default: null,
    },
    userName: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username must be unique"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists!!"],
      // match: [/\S+@\S+\.\S+/, "is invalid"],
    },
    password: {
      type: String,
      // required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    // phoneNumber: {
    //   type: String,
    //   match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number"],
    // },
    userRole: {
      type: String,
      enum: ["buyer", "seller"],
      default: "buyer",
    },
  },
  { timeStamps: true }
);

//Generate Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

export default mongoose.model("User", userSchema);
