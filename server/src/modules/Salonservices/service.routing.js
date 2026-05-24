const express = require("express");
const serviceRoute = express.Router();
const serviceCtrl = require("./service.controller");
const adminCheck =require('../../middleware/auth.middleware')

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Create a new service
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - duration_minutes
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Deep Tissue Massage"
 *               description:
 *                 type: string
 *                 example: "A therapeutic massage focused on relieving deep muscle tension."
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 85.00
 *               duration_minutes:
 *                 type: integer
 *                 example: 30
 *               is_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Service created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */

serviceRoute.post("/", adminCheck, serviceCtrl.create);

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Get all services
 *     tags:
 *       - Services
 *     responses:
 *       200:
 *         description: List of services
 */

serviceRoute.get("/", serviceCtrl.listAll);


 /**
 * @swagger
 * /services/{id}:
 *   patch:
 *     summary: Update service
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Deep Tissue Massage"
 *               description:
 *                 type: string
 *                 example: "Updated description for muscle relaxation therapy"
 *               price:
 *                 type: number
 *                 example: 100
 *               duration_minutes:
 *                 type: integer
 *                 example: 60
 *               is_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Service updated successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Service not found
 */
serviceRoute.patch("/:id", adminCheck, serviceCtrl.update);
/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     summary: Delete service
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service deleted
 */
serviceRoute.delete("/:id", adminCheck, serviceCtrl.deleteService);
/**
 * @swagger
 * /services/{id}:
 *   get:
 *     summary: Get service by ID
 *     tags:
 *       - Services
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service fetched successfully
 *       404:
 *         description: Service not found
 */
serviceRoute.get("/:id", serviceCtrl.getById);

module.exports = serviceRoute;