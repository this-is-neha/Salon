const db = require("../../config/db.config");

class ServiceService {
  createService = async (data) => {
    const query = `
      INSERT INTO services (name, description, price, duration_minutes)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [
      data.name,
      data.description,
      data.price,
      data.duration_minutes,
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  };

  getAllServices = async () => {
    const query = `SELECT * FROM services ORDER BY name ASC;`;
    const result = await db.query(query);
    return result.rows;
  };
  hardDeleteService = async (id) => {
    const sql = `DELETE FROM services WHERE id = $1 RETURNING *`;
    const result = await db.query(sql, [id]);

    return result.rows[0];
  };

  getServiceById = async (id) => {
    const query = `SELECT * FROM services WHERE id = $1;`;
    const result = await db.query(query, [id]);
    return result.rows[0];
  };

  updateService = async (id, data) => {
    const keys = Object.keys(data);
    if (keys.length === 0) {
      return await this.getServiceById(id);
    }

    const setClause = keys
      .map((key, index) => `"${key}" = $${index + 1}`)
      .join(", ");

    const query = `
    UPDATE services 
    SET ${setClause}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $${keys.length + 1}
    RETURNING *;
  `;

    const values = [...Object.values(data), id];

    const result = await db.query(query, values);
    return result.rows[0];
  };

  softDeleteService = async (id) => {
    const query = `
      UPDATE services 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  };
}

module.exports = new ServiceService();
