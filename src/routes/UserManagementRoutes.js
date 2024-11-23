const express = require("express");
const router = express.Router();
const verifyRole = require("../middleware/RoleMiddleware");
const {getAllUsers,getSingleUser} = require("../controllers/UserManagementController")

router.get('/users/getAllUsers',verifyRole(["admin"]),getAllUsers)
router.get('/users/getSingleUser',getSingleUser)


module.exports = router