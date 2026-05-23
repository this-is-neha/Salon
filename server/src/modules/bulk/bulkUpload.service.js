const { bulkQueue } = require("../../config/queue.config");
const db = require("../../config/db.config");
const xlsx = require("xlsx");

const initiateBulkUpload = async (file, staffId, templateId) => { 
  const workbook = xlsx.read(file.buffer, { type: "buffer" });
  const rows = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
  
 
  const query = `INSERT INTO bulk_job_batches (staff_id, file_name, total_records, status) 
                 VALUES ($1, $2, $3, 'processing') RETURNING id`;
  const result = await db.query(query, [staffId, file.originalname, rows.length]);
  const batchId = result.rows[0].id;

  
  const jobs = rows.map(row => ({
    name: 'process-appointment',
    data: { 
        data: row, 
        batchId, 
        totalRows: rows.length, 
        staffId, 
        templateId 
    }
  }));
  
  await bulkQueue.addBulk(jobs);

  return { id: batchId };
};

module.exports = { initiateBulkUpload };