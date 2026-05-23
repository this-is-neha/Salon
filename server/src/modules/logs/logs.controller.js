const db = require("../../config/db.config");

const getAppointmentLogs = async (req, res, next) => {
  try {
    const query = `
      SELECT al.*, b.file_name, a.start_time
      FROM appointment_logs al
      LEFT JOIN bulk_job_batches b ON al.batch_id = b.id
      LEFT JOIN appointments a ON al.appointment_id = a.id
      ORDER BY al.sent_at DESC
    `;
    const result = await db.query(query);
    res.status(200).json({ logs: result.rows });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAppointmentLogs };