const express = require("express");
const router = express.Router();
const verifyRole = require("../middleware/RoleMiddleware")
const {creteTeam,getAllTeams,getSingleTeam} = require("../controllers/")

router.post("/createTeam",verifyRole(["admin","manager"]),creteTeam) 
router.post("/getAllTeams",verifyRole(["admin"]),getAllTeams)
router.post('/getSingleTeam:id',verifyRole(["admin","manaager"]),getSingleTeam)


module.exports = router;