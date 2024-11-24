
/**
 * @swagger
 * tags:
 *   - name: User Management
 *     description: APIs related to user management (Admin only)
 */
const express = require("express");
const router = express.Router();
const verifyRole = require("../middleware/RoleMiddleware");
const {getAllUsers,getSingleUser} = require("../controllers/UserManagementController")

/**
 * @swagger
 * /users/getAllUsers:
 *   get:
 *     summary: Get all users (Admin and manager only)
 *     tags: [User Management]
 *     security:
 *       - cookie auth: []  # Requires authentication with cookies
 *     responses:
 *       200:
 *         description: Successfully retrieved all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether the request was successful
 *                 users:
 *                   type: array
 *                   description: List of all users
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: User ID
 *                       name:
 *                         type: string
 *                         description: User's full name
 *                       email:
 *                         type: string
 *                         description: User's email address
 *                       role:
 *                         type: string
 *                         description: User's assigned role
 *       403:
 *         description: Forbidden (User does not have admin rights)
 *       500:
 *         description: Server error
 */
router.get('/users/getAllUsers',verifyRole(["admin","manager"]),getAllUsers);

/**
 * @swagger
 * /users/getSingleUser:
 *   get:
 *     summary: Get a single user's details
 *     tags: [User Management]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         description: ID of the user whose details are to be fetched
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether the request was successful
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: User ID
 *                     name:
 *                       type: string
 *                       description: User's full name
 *                     email:
 *                       type: string
 *                       description: User's email address
 *                     role:
 *                       type: string
 *                       description: User's assigned role
 *       400:
 *         description: Missing userId parameter
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/users/getSingleUser',getSingleUser)


module.exports = router