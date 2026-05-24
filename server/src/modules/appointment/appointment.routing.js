const express = require("express");
const appointmentRoute = express.Router();

const appointmentCtrl = require("./appointment.controller");
const authMiddleware = require("../../middleware/user.middleware");
const roleCheck = require("../../middleware/role.middleware");

/**
 * @swagger
 * /appointment:
 *   post:
 *     summary: Create appointment
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer_id
 *               - service_id
 *               - start_time
 *               - end_time
 *             properties:
 *               customer_id:
 *                 type: string
 *                 example: "6528a198-d9c3-42da-a143-0d475dfcc57a"
 *               service_id:
 *                 type: string
 *                 example: "5aacd80d-d59c-49f0-984c-63b97f3446ad"
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-05-24T10:00:00Z"
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-05-24T11:00:00Z"
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled, completed]
 *                 example: "pending"
 *     responses:
 *       201:
 *         description: Appointment created
 */
appointmentRoute.post("/", authMiddleware, appointmentCtrl.create);

/**
 * @swagger
 * /appointment:
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
 * /appointment/{id}:
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
 *         example: "a12b34c5-d678-90ef-gh12-345678ijklmn"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-05-24T12:00:00Z"
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-05-24T13:00:00Z"
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled, completed]
 *                 example: "confirmed"
 *     responses:
 *       200:
 *         description: Appointment updated
 */
appointmentRoute.patch("/:id", authMiddleware, appointmentCtrl.update);

// /**
//  * @swagger
//  * /appointment/{id}:
//  *   patch:
//  *     summary: Update appointment
//  *     tags:
//  *       - Appointments
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Appointment updated
//  */
// appointmentRoute.patch("/:id", authMiddleware, appointmentCtrl.update);
/**
 * @swagger
 * /appointment/{id}:
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
appointmentRoute.delete(
  "/:id",
  authMiddleware,
  appointmentCtrl.deleteAppointment,
);
/**
 * @swagger
 * /appointment/admin/all:
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
appointmentRoute.get(
  "/admin/all",
  authMiddleware,
  roleCheck("admin"),
  appointmentCtrl.listAll,
);
/**
 * @swagger
 * /appointment/customer/{customerId}:
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
appointmentRoute.get(
  "/customer/:customerId",
  authMiddleware,
  appointmentCtrl.getByCustomer,
);

module.exports = appointmentRoute;
