const express = require("express");
const serviceRoute = express.Router();
const serviceCtrl = require("./service.controller");
const adminCheck =require('../../middleware/auth.middleware')
/**
 * @swagger
 * /services:
 *   post:
 *     summary: Create a service
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
 *     responses:
 *       201:
 *         description: Service created
 */
serviceRoute.post("/",  adminCheck,serviceCtrl.create);
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
 *     responses:
 *       200:
 *         description: Service updated
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