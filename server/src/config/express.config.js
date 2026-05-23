const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const Joi = require("joi");
require("./db.config");
const mainRouter = require("./routing.config");
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const app = express();

app.use(helmet());

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Bulk Appointment API', version: '1.0.0' },
  },
  
  apis: ['./src/modules/**/*.routing.js', './src/modules/**/*.routes.js'],
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(options)));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/assets', express.static('./public/'));

app.get("/", (req, res) => {
  res.json({
    message: "Salon Booking System backend is live 🚀",
  });
});

console.log("This is Neha");


app.use(mainRouter);


app.use((req, res, next) => {
  next({
    code: 404,
    message: "Resource not found",
  });
});

app.use((error, req, res, next) => {
  
  console.error("====== System Error Intercepted ======");
  console.error(error);


  let statusCode = typeof error.code === 'number' ? error.code : 500;
  let data = error.data || null;
  let msg = error.message || "Internal server error";


  if (error instanceof Joi.ValidationError) {
    statusCode = 422;
    msg = "Validation Failed";
    data = {};
    const errorDetail = error.details;
    if (Array.isArray(errorDetail)) {
      errorDetail.forEach((errorObj) => {
        data[errorObj.context.label] = errorObj.message;
      });
    }
  }


  if (error.code === '23505') {
    statusCode = 400;
    msg = "Validation Failed: A record with this unique value already exists.";
    data = {};
    
    if (error.detail) {
      const match = error.detail.match(/\((.*?)\)=\((.*?)\)/);
      if (match && match[1]) {
        data[match[1]] = `${match[1]} must be completely unique`;
      }
    }
  }

  if (error.code === '22P02') {
    statusCode = 400;
    msg = "Database Constraint Error: Provided input type mapping or enum option value is invalid.";
  }

  res.status(statusCode).json({
    result: data,
    message: msg,
    meta: null,
  });
});

module.exports = app;