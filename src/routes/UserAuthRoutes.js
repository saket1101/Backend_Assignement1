const express = require("express");
const router = express.Router();
const Auth = require("../middleware/AuthMiddleware");
const {
  registerUser,
  loginUser,
  logoutUser,getUserProfile
} = require("../controllers/UserAuthController");

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/logout", Auth, logoutUser);

// get user profile 
router.get('/users/profile',Auth,getUserProfile)

module.exports = router;
