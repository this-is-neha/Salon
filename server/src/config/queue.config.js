const { Queue } = require('bullmq');

const connection = { host: '127.0.0.1', port: 6379 };
const bulkQueue = new Queue('bulk-appointments', { connection });

module.exports = { bulkQueue };