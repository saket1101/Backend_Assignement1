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
} = require("../controllers/UserAuthController");

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
 *         description: User registered successfully
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
router.post("/auth/logout", logoutUser);


module.exports = router;
