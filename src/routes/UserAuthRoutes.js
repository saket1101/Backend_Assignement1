const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/UserAuthController");

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/logout", logoutUser);


module.exports = router;
