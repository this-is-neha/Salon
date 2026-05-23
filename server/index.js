// require("dotenv").config();
// require("./src/config/db.config");
// const socketConfig = require("./src/config/socket");
// require("./src/modules/bulk/appointment.worker");
// const http = require("http");
// const app = require("./src/config/express.config");

// const port = process.env.PORT || 9006;

// const server = http.createServer(app);

// socketConfig.init(server);

// server.listen(port, () => {
//   console.log(`Server is running successfully on port ${port}`);
//   console.log("I am Neha");
// });

require("dotenv").config();
require("./src/config/db.config");
const socketConfig = require("./src/config/socket");
require("./src/modules/bulk/appointment.worker");
const http = require("http");
const app = require("./src/config/express.config");

// --- ADD SWAGGER CONFIGURATION HERE ---
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bulk Appointment API',
      version: '1.0.0',
      description: 'API documentation',
    },
    servers: [{ url: 'http://localhost:9006' }],
  },
  // This tells Swagger to look at all your route files
  apis: ['./src/modules/**/*.routing.js', './src/modules/**/*.routes.js'], 
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// --------------------------------------

const port = process.env.PORT || 9006;
const server = http.createServer(app);

socketConfig.init(server);

server.listen(port, () => {
  console.log(`Server is running successfully on port ${port}`);
  console.log("Swagger documentation available at http://localhost:9006/api-docs");
  console.log("I am Neha");
});