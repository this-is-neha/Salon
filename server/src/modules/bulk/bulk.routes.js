const express = require("express");
const bulkRoute = express.Router();
const BulkUploadController=require( './bulkUpload.controller');
const  socketMiddleware =require( '../../middleware/socketmiddleware');
const multer =require('multer');
const upload = multer({ storage: multer.memoryStorage() });
/**
 * @swagger
 * /bulk/upload:
 *   post:
 *     summary: Upload and process bulk appointments
 *     tags:
 *       - Bulk
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               templateId:
 *                 type: string
 *                 description: The ID of the template to use for this import
 *     responses:
 *       202:
 *         description: Import process initiated
 */

bulkRoute.post(
  '/upload', 
  socketMiddleware, 
  upload.single('file'), 
 BulkUploadController.uploadBulkAppointments
);

module.exports=bulkRoute