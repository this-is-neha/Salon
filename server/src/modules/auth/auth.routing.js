const express = require("express");
const authRoute = express.Router();
const authCtrl = require("./auth.controller");

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Password123"
 *               role:
 *                 type: string
 *                 enum: [customer, staff, admin]
 *                 example: "customer"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */
authRoute.post("/register", authCtrl.register);

/**
 * @swagger
 * /auth/activate/{token}:
 *   get:
 *     summary: Activate user account
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         example: "a1b2c3d4e5f6"
 *     responses:
 *       200:
 *         description: Account activated successfully
 *       400:
 *         description: Invalid or expired token
 */
authRoute.get("/activate/:token", authCtrl.activate);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Password123"
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
authRoute.post("/login", authCtrl.login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get logged-in user profile
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged-in user data
 *         content:
 *           application/json:
 *             example:
 *               id: "550e8400-e29b-41d4-a716-446655440000"
 *               name: "John Doe"
 *               email: "john@example.com"
 *               role: "customer"
 *               is_verified: true
 *       401:
 *         description: Unauthorized
 */
authRoute.get("/me", authCtrl.getLoggedIn);

/**
 * @swagger
 * /auth/all:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             example:
 *               - id: "550e8400-e29b-41d4-a716-446655440000"
 *                 name: "John Doe"
 *                 email: "john@example.com"
 *                 role: "customer"
 *                 is_verified: true
 *               - id: "660e8400-e29b-41d4-a716-446655440111"
 *                 name: "Admin User"
 *                 email: "admin@example.com"
 *                 role: "admin"
 *                 is_verified: true
 *       401:
 *         description: Unauthorized
 */
authRoute.get("/all", authCtrl.getAllUsers);

/**
 * @swagger
 * /auth/isloggedIn:
 *   get:
 *     summary: Check if user is logged in
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User session is valid
 *         content:
 *           application/json:
 *             example:
 *               loggedIn: true
 *               user:
 *                 id: "550e8400-e29b-41d4-a716-446655440000"
 *                 email: "john@example.com"
 *                 role: "customer"
 *       401:
 *         description: Not logged in or token expired
 */
authRoute.get("/isloggedIn", authCtrl.loginCheck);

module.exports = authRoute;