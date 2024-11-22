const express = require("express");
const router = express.Router();
const verifyRole = require("../middleware/RoleMiddleware");

// Assign or update a role (Admin only)
router.post("/roles/assign", Auth, verifyRole("Admin"), assignRole);

// Get all available roles
router.get("/roles", Auth, verifyRole("Admin", "Manager"), getRoles);

// Get a user's role
router.get("/roles/:userId", Auth, verifyRole("Admin", "Manager"), getUserRole);

module.exports = router;
