const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // input validation
    if (!username || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields (username, email, password, role) are required.",
      });
    }

    if (username.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Username must be at least 3 characters long.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address.",
      });
    }

    if (password.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 5 characters long.",
      });
    }

    // check  email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    // hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create a user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
    });
  } catch (error) {
    console.error("Error in registerUser:", error.message);
    res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing Required fields",
      });
    }
    const finduser = await User.findOne({ email: email }).exec();

    if (!finduser) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const existingpassword = finduser.password;

    const comparePasword = await bcrypt.compare(password, existingpassword);

    if (!comparePasword) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password!" });
    }
    const generateToken = jwt.sign(
      { id: finduser._id, role: finduser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res
      .cookie("Authtoken", generateToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ success: true, message: "User logged in successfully" });
  } catch (error) {
    console.error("Error in registerUser:", error.message);
    res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    res.clearCookie("Authtoken").json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Error in logoutUser:", error.message);
    res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
    });
  }
};

module.exports = { registerUser, loginUser, logoutUser };
