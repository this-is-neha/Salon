const bulkUploadSvc = require("./bulkUpload.service");

const uploadBulkAppointments = async (req, res, next) => {
  try {
  console.log("DEBUG: Reached controller function")
    console.log("DEBUG: Request Body received:", req.body);
    
    if (!req.file) {
      console.log("DEBUG: No file found in request.");
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { templateId } = req.body;
    console.log("DEBUG: Template ID extracted:", templateId);

    const batch = await bulkUploadSvc.initiateBulkUpload(req.file, req.user.id, templateId);
    
    res.status(202).json({ batchId: batch.id });
  } catch (exception) {
    console.error("DEBUG: Error in uploadBulkAppointments:", exception.message);
    next(exception);
  }
};

module.exports = { uploadBulkAppointments };