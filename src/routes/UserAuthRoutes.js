/**
 * @swagger
 * tags:
 *   name: User Authentication
 *   description: API for user authentication (register, login and logout,)
 */

const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  createFirstAdmin,
} = require("../controllers/UserAuthController");
const UserAuthentication = require("../middleware/AuthMiddleware");


/**
 * @swagger
 * /auth/registerAdmin:
 *   post:
 *     summary: Register as a admin 
 *     description: Creates the first admin user using a secret key. This route should only be accessible during the initial setup and requires a valid secret key for authorization.
 *     tags: [User Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               secretKey:
 *                 type: string
 *                 description: Secret key required to create the first admin. Must match the server's environment variable `ADMIN_SECRET`.
 *                 example: "Psiborg@123"
 *               username:
 *                 type: string
 *                 description: Username for the admin account.
 *                 example: "admin"
 *               email:
 *                 type: string
 *                 description: Email address for the admin account.
 *                 format: email
 *                 example: "admin@gmail.com"
 *               password:
 *                 type: string
 *                 description: Password for the admin account.
 *                 format: password
 *                 example: "secureAdminPassword"
 *             required:
 *               - secretKey
 *               - username
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Admin crated successfulyy. A thank-you email will be sent to the admin's email address.
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
 *                   example: "Admin created successfully"
 *                 admin:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64b01f0f9c930fb0e8a1e0bc"
 *                     username:
 *                       type: string
 *                       example: "admin"
 *                     email:
 *                       type: string
 *                       example: "admin@gamil.com"
 *                     role:
 *                       type: string
 *                       example: "admin"
 *       403:
 *         description: Invalid secret key provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid secret key"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred during admin creation"
 */
router.post("/auth/registerAdmin", createFirstAdmin);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: saket jha
 *               email:
 *                 type: string
 *                 example: saket@gmail.com
 *               password:
 *                 type: string
 *                 example: saket1234
 *     responses:
 *       201:
 *         description: User registered successfully. A thank-you email will be sent to the user's email address.
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already registered
 *       500:
 *         description: Internal server error
 */
router.post("/auth/register", registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [User Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: saket@gmaiil.com
 *               password:
 *                 type: string
 *                 example: saket1234
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Missing fields or invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post("/auth/login", loginUser);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [User Authentication]
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       400:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post("/auth/logout", UserAuthentication, logoutUser);



module.exports = router;
