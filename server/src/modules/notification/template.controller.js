const notificationSvc = require("./template.services");

const getTemplates = async (req, res, next) => {
  try {
    const { status } = req.query; 
    const templates = await notificationSvc.getAllTemplates(status);
    res.status(200).json(templates);
  } catch (error) {
    next(error);
  }
};

module.exports = { getTemplates };