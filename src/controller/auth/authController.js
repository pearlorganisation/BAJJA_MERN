import User from "../../models/user/user.js";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
  try {
    const { userName, email, password, userRole } = req.body;
    if (!userName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    let existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User name must be unique" });
    }
    existingUser = await User.findOne({ email });

    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!regex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      ...req?.body,
      password: hashedPassword,
    });

    res
      .status(201)
      .json({ success: true, message: "User register successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.message || "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ success: false, message: "No user found" });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isValidPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Wrong password" });
    }

    const api_key = existingUser.generateAccessToken();
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      api_key,
      userName: existingUser.userName,
      email: existingUser.email,
      userRole: existingUser.userRole,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error?.message || "Internal server error",
    });
  }
};
