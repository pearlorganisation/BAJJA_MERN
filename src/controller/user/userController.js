import User from "../../models/user/user.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id).select("-password");
    if (!user) {
      return res.status(200).json({ success: true, user });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error: ", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
