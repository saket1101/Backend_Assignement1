const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const UserAuthentication = async (req, res, next) => {
  const token = req.cookies.Authtoken;

  if (!token) {
    return res
      .status(401)
      .json({ message: "User not authenticated" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res
      .status(500)
      .json({ message: "Internal server error during authentication." });
  }
};

module.exports = UserAuthentication;
