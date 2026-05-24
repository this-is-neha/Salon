const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const { getIO } = require('../../config/socket');
const db = require('../../config/db.config');
const { sendEmail } = require('../services/mail.services');

const redisConnection = new IORedis({ 
    host: '127.0.0.1', 
    port: 6379, 
    maxRetriesPerRequest: null 
});

const worker = new Worker('bulk-appointments', async (job) => {
    const { data, batchId, totalRows, staffId, templateId } = job.data;
    let appointmentId = null; 
    let customerEmail = data.CustomerName || 'unknown@example.com'; 

    try {
      
        const templateRes = await db.query(
            'SELECT body_text, status FROM notification_templates WHERE id = $1', [templateId]
        );
        if (templateRes.rows.length === 0) throw new Error(`Template not found: ${templateId}`);
        const { body_text, status: appointmentStatus } = templateRes.rows[0];

        const customerRes = await db.query('SELECT id, email FROM users WHERE name = $1 LIMIT 1', [data.CustomerName]);
        if (customerRes.rows.length === 0) throw new Error(`Customer ${data.CustomerName} not found`);
        customerEmail = customerRes.rows[0].email;
        const customerId = customerRes.rows[0].id;

        const serviceRes = await db.query('SELECT id, duration_minutes FROM services WHERE name = $1 LIMIT 1', [data.ServiceName]);
        if (serviceRes.rows.length === 0) throw new Error(`Service ${data.ServiceName} not found`);
        const { id: serviceId, duration_minutes } = serviceRes.rows[0];

      
        const startTime = new Date(data.AppointmentDate);
        const endTime = new Date(startTime.getTime() + duration_minutes * 60000);
        const apptRes = await db.query(
            'INSERT INTO appointments (customer_id, service_id, start_time, end_time, status) VALUES ($1, $2, $3, $4, $5) RETURNING id', 
            [customerId, serviceId, startTime, endTime, appointmentStatus]
        );
        appointmentId = apptRes.rows[0].id;

        const emailBody = body_text.replace(/{{customer_name}}/g, data.CustomerName).replace(/{{service_name}}/g, data.ServiceName);
        await sendEmail(customerEmail, "Appointment Confirmation", emailBody);

 
        const res = await db.query(
            'UPDATE bulk_job_batches SET processed_records = processed_records + 1 WHERE id = $1 RETURNING processed_records', [batchId]
        );
        
        const processedCount = parseInt(res.rows[0].processed_records);
        const percentage = processedCount >= totalRows ? 100 : Math.round((processedCount / totalRows) * 100);
        const isComplete = processedCount >= totalRows;

    
        await db.query('INSERT INTO appointment_logs (batch_id, appointment_id, recipient_email, status) VALUES ($1, $2, $3, $4)', 
            [batchId, appointmentId, customerEmail, 'success']);

        console.log(`DEBUG: Emitting success for ${customerEmail}`);
        getIO().emit('appointment-status-update', { 
            batchId, 
            status: isComplete ? 'completed' : 'success', 
            percentage,
            recipient_email: customerEmail,
            sent_at: new Date()
        });

    } catch (err) {
        console.error(`DEBUG: Worker error: ${err.message}`);
        await db.query('INSERT INTO appointment_logs (batch_id, recipient_email, status, error_message) VALUES ($1, $2, $3, $4)', 
            [batchId, customerEmail, 'failed', err.message]);

        // Emit Failure
        getIO().emit('appointment-status-update', { 
            batchId, 
            status: 'failed', 
            error: err.message,
            recipient_email: customerEmail,
            sent_at: new Date()
        });
        throw err; 
    }
}, { connection: redisConnection, concurrency: 5 });

module.exports = { worker };