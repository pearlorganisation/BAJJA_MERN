import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AVAILABLE_USER_ROLES, USER_ROLES_ENUM } from "../../../constants.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    profilePic: {
      type: String,
      default: null,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      // match: [/\S+@\S+\.\S+/, "is invalid"],
    },
    password: {
      type: String,
      // required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    // mobileNumber: {
    //   type: String,
    //   match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number"],
    // },
    uid: {
      type: String,
      default: null,
    },
    fid: {
      type: String,
      default: null,
    },
    userRole: {
      type: String,
      enum: AVAILABLE_USER_ROLES,
      default: USER_ROLES_ENUM.BUYER,
    },
    fcmToken: {
      type: String,
      default: null, 
    },
  },
  { timeStamps: true }
);

// Pre-save hook to hash password before saving it to DB
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

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

// Method to update the FCM token
userSchema.methods.updateFcmToken = async function (newToken) {
  this.fcmToken = newToken;
  await this.save();
};

export default mongoose.model("User", userSchema);
