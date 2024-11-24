/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Role APIs
 */
const express = require("express");
const router = express.Router();
const verifyRole = require("../middleware/RoleMiddleware");
const {assignRole} = require("../controllers/RoleController")

// Assign or update a role (Admin only)
/**
 * @swagger
 * /roles/assign/{id}:
 *   post:
 *     summary: Assign or update a role (Admin only)
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to whom the role will be assigned or updated
 *         schema:
 *           type: string
 *       - in: body
 *         name: role
 *         required: true
 *         description: The role to assign or update for the user
 *         schema:
 *           type: object
 *           properties:
 *             role:
 *               type: string
 *               enum: [admin, manager, user]
 *               description: The role to be assigned to the user
 *     security:
 *       - bearerAuth: []  # Indicates that this API requires authentication via bearer token
 *     responses:
 *       200:
 *         description: Role assigned or updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message of the successful role assignment or update
 *       400:
 *         description: Invalid input or missing role field in request body
 *       403:
 *         description: Forbidden (User does not have admin rights)
 *       404:
 *         description: User not found (Invalid user ID)
 *       500:
 *         description: Server error
 */
router.post("/roles/assign/:id", verifyRole(["admin"]), assignRole);




module.exports = router;
