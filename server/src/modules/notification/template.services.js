const db = require("../../config/db.config");

const getAllTemplates = async (status) => {
  if (status) {
    const result = await db.query("SELECT * FROM notification_templates WHERE status = $1", [status]);
    return result.rows;
  }
  const result = await db.query("SELECT * FROM notification_templates");
  return result.rows;
};



const getTemplateById = async (id) => {
  const result = await db.query("SELECT * FROM notification_templates WHERE id = $1", [id]);
  return result.rows[0];
};

module.exports = { getAllTemplates, getTemplateById };