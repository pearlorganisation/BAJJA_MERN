import User from "../models/user/user.js";
import jwt from "jsonwebtoken";

export const authenticateToken = async (req, res, next) => {
  try {
    const token =
      req.cookies?.api_key || req.header("authorization")?.split(" ")[1];
    if (!token)
      return res
        .status(401)
        .json({ success: true, message: "Unauthorized user" });
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    const userDoc = await User.findById(decoded._id).select("userRole");
    if (!userDoc) {
      return res.status(404).json({ success: false, message: "No user found" });
    }
    req.user = { _id: decoded._id, role: userDoc.userRole };
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
