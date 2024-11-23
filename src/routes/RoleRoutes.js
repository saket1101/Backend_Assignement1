const express = require("express");
const router = express.Router();
const verifyRole = require("../middleware/RoleMiddleware");
const {assignRole} = require("../controllers/RoleController")

// Assign or update a role (Admin only)
router.post("/roles/assign/:id", Auth, verifyRole("Admin"), assignRole);



module.exports = router;
