const express = require("express");
const authRoute = express.Router();
const authCtrl = require("./auth.controller");

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: User registered
 */
authRoute.post("/register", authCtrl.register);
/**
 * @swagger
 * /auth/activate/{token}:
 *   get:
 *     summary: Activate account
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account activated
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
 *     responses:
 *       200:
 *         description: Login successful
 */
authRoute.post("/login", authCtrl.login);
/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get logged-in user
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data
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
 *       401:
 *         description: Not logged in or token expired
 */
authRoute.get("/isloggedIn", authCtrl.loginCheck);

module.exports = authRoute;