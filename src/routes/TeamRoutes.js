/**
 * @swagger
 * tags:
 *   name: Team
 *   description: Team management APIs
 */
const express = require("express");
const router = express.Router();
const verifyRole = require("../middleware/RoleMiddleware");
const { createTeam, getAllTeams, getSingleTeam } = require("../controllers/TeamController");

/**
 * @swagger
 * /createTeam:
 *   post:
 *     summary: Create a new team
 *     tags: [Teams]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Development Team
 *               managerId:
 *                 type: string
 *                 example: 646d4e8e8495c5c3ad98a2d2
 *               members:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: string
 *                       example: 646d4e8e8495c5c3ad98a2d3
 *     responses:
 *       201:
 *         description: Team created successfully
 *       500:
 *         description: Internal server error
 */
router.post("/createTeam", verifyRole(["admin", "manager"]), createTeam);

/**
 * @swagger
 * /getAllTeams:
 *   post:
 *     summary: Get all teams
 *     tags: [Teams]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: All teams successfully fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: All teams successfully fetched
 *                 teams:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal server error
 */
router.post("/getAllTeams", verifyRole(["admin"]), getAllTeams);

/**
 * @swagger
 * /getSingleTeam/{id}:
 *   post:
 *     summary: Get details of a single team
 *     tags: [Teams]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 646d4e8e8495c5c3ad98a2d5
 *     responses:
 *       200:
 *         description: Team fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Team fetched successfully
 *                 team:
 *                   type: object
 *       404:
 *         description: Team not found
 *       500:
 *         description: Internal server error
 */
router.post("/getSingleTeam/:id", verifyRole(["admin", "manager"]), getSingleTeam);

module.exports = router;
