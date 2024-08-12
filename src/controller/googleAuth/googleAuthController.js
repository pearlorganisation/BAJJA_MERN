import user from "../../models/user/user.js";

export const googleAuth = async (req, res) => {
  try {
    const { uid, userName, email, userRole } = req.body;
    if (!uid || !userName || !email || !userRole) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    let existingUser = await user.findOne({ email });
    if (!existingUser) {
      // Create a new user if they don't exist
      existingUser = new user({ uid, userName, email, userRole });
      await existingUser.save();
    } else if (!existingUser.uid) {
      // If the user exists but doesn't have a googleId, add it
      existingUser.uid = uid;
      existingUser.userRole = userRole;
      await existingUser.save();
    }
    const token = existingUser.generateAccessToken();

    res.status(201).json({
      success: true,
      message: "User successfully authenticated with Google.",
      token,
      userRole: existingUser.userRole,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.message || "Internal server error",
    });
  }
};
