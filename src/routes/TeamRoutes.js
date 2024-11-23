const express = require("express");
const router = express.Router();
const Auth = require("../middleware/AuthMiddleware");
const verifyRole = require("../middleware/RoleMiddleware")
const {creteTeam,getAllTeams,getSingleTeam} = require("../controllers/")

router.post("/createTeam",Auth,verifyRole(["admin","manager"]),creteTeam) 
router.post("/getAllTeams",Auth,verifyRole(["admin"]),getAllTeams)
router.post('/getSingleTeam:id',Auth,verifyRole(["admin","manaager"]),getSingleTeam)


module.exports = router;