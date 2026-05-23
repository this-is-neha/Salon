const express = require("express");
const router = express.Router();
const { getTemplates } = require("./template.controller");
const  authenticate  = require("../../middleware/auth.middleware"); 
/**
 * @swagger
 * /templates:
 *   get:
 *     summary: Get all templates
 *     tags:
 *       - Templates
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Templates fetched successfully
 */

router.get("/templates", authenticate, getTemplates);

module.exports = router;