const express = require("express");
const router = express.Router();
const Auth = require("../middleware/AuthMiddleware");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/UserAuthController");

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/logout", Auth, logoutUser);

module.exports = router;
