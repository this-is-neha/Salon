const express = require('express');
const router = express.Router();
const logController = require('./logs.controller');
const auth = require('../../middleware/auth.middleware');
/**
 * @swagger
 * /logs:
 *   get:
 *     summary: Get appointment logs
 *     tags:
 *       - Logs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logs fetched successfully
 */

router.get('/', auth, logController.getAppointmentLogs);
module.exports = router;

