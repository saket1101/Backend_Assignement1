const express = require("express");
const router = express.Router();
const roleMiddleware = require("../middleware/RoleMiddleware");

// admin routes for role based
router.get("/admin/dashboard", roleMiddleware(["admin"]), (req, res) => {
  res.status(200).json({ message: "Admin dashboard" });
});

// manager and admin routes for role based
router.get(
  "/manager/dashboard",
  roleMiddleware(["admin", "manager"]),
  (req, res) => {
    res.status(200).json({ message: "Manager dashboard" });
  }
);

// every one can access this route
router.get(
  "/user/dashboard",
  roleMiddleware(["admin", "manager", "user"]),
  (req, res) => {
    res.status(200).json({ message: "User dashboard" });
  }
); // Admin can access all routes

module.exports = router;
