const db = require("../../config/db.config");

class AppointmentService {
  createAppointment = async (data) => {
    const query = `
      INSERT INTO appointments (customer_id, service_id, start_time, end_time, status)
      VALUES ($1, $2, $3, $4, 'pending')
      RETURNING *;
    `;
    const values = [data.customer_id, data.service_id, data.start_time, data.end_time];
    const result = await db.query(query, values);
    return result.rows[0];
  };

  getAllAppointments = async () => {
   
    const query = `
      SELECT a.*, s.name as service_name, u.name as customer_name 
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      JOIN users u ON a.customer_id = u.id
      ORDER BY a.start_time DESC;
    `;
    const result = await db.query(query);
    return result.rows;
  };

  getAppointmentsByCustomer = async (customerId) => {
    const query = `
      SELECT a.*, s.name as service_name 
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      WHERE a.customer_id = $1
      ORDER BY a.start_time DESC;
    `;
    const result = await db.query(query, [customerId]);
    return result.rows;
  };

  getAppointmentById = async (id) => {
    const query = `SELECT * FROM appointments WHERE id = $1;`;
    const result = await db.query(query, [id]);
    return result.rows[0];
  };

  updateAppointment = async (id, data) => {
    const keys = Object.keys(data);
    const setClause = keys
      .map((key, index) => `"${key}" = $${index + 1}`)
      .join(", ");

    const query = `
      UPDATE appointments 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${keys.length + 1}
      RETURNING *;
    `;
    const values = [...Object.values(data), id];
    const result = await db.query(query, values);
    return result.rows[0];
  };

  deleteAppointment = async (id) => {
    const query = `DELETE FROM appointments WHERE id = $1 RETURNING *;`;
    const result = await db.query(query, [id]);
    return result.rows[0];
  };
}

module.exports = new AppointmentService();