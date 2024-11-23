const express = require("express");
const router = express.Router();
const verifyRole = require("../middleware/RoleMiddleware");
const Auth = require("../middleware/AuthMiddleware");
const {getAllUsers,getSingleUser} = require("../controllers/UserManagementController")

router.get('/users/getAllUsers',Auth,verifyRole(["admin"]),getAllUsers)
router.get('/users/getSingleUser',Auth,getSingleUser)


module.exports = router