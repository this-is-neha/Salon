
const express = require("express");
const appointmentRoute = express.Router();

const appointmentCtrl = require("./appointment.controller");
const authMiddleware = require("../../middleware/user.middleware");
const roleCheck = require("../../middleware/role.middleware"); 
/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Create appointment
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Appointment created
 */
appointmentRoute.post("/", authMiddleware, appointmentCtrl.create);
/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Get all appointments
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointments
 */
appointmentRoute.get("/", authMiddleware, appointmentCtrl.listAll);
/**
 * @swagger
 * /appointments/{id}:
 *   patch:
 *     summary: Update appointment
 *     tags:
 *       - Appointments
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
 *         description: Appointment updated
 */
appointmentRoute.patch("/:id", authMiddleware, appointmentCtrl.update);
/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Delete appointment
 *     tags:
 *       - Appointments
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
 *         description: Appointment deleted
 */
appointmentRoute.delete("/:id", authMiddleware, appointmentCtrl.deleteAppointment);
/**
 * @swagger
 * /appointments/admin/all:
 *   get:
 *     summary: Get all appointments (Admin only)
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all appointments for admin
 *       403:
 *         description: Forbidden (not admin)
 */
appointmentRoute.get("/admin/all",authMiddleware,roleCheck("admin"),appointmentCtrl.listAll);
/**
 * @swagger
 * /appointments/customer/{customerId}:
 *   get:
 *     summary: Get appointments by customer ID
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the customer
 *     responses:
 *       200:
 *         description: Customer appointments fetched successfully
 *       404:
 *         description: No appointments found
 */
appointmentRoute.get("/customer/:customerId",authMiddleware,appointmentCtrl.getByCustomer);

module.exports = appointmentRoute;