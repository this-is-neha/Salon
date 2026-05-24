const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const Joi = require("joi");
require("./db.config");
const mainRouter = require("./routing.config");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();

// ✅ Must come BEFORE helmet
app.use("/api-docs", swaggerUi.serve);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,   // ← add this too
    crossOriginResourcePolicy: false,   // ← and this
  })
);

app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/assets", express.static("./public"));

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: { title: "Bulk Appointment API", version: "1.0.0" },
    servers: [
      {
        url: "http://localhost:9006",   // ✅ your actual port
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/modules/**/*.routing.js", "./src/modules/**/*.routes.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// ✅ Setup AFTER serve, and AFTER helmet
app.get("/api-docs", (req, res) => {
  res.send(swaggerUi.generateHTML(swaggerSpec, {
    swaggerOptions: { persistAuthorization: true },
  }));
});

app.get("/", (req, res) => {
  res.json({ message: "Salon Booking System backend is live" });
});

app.use(mainRouter);

app.use((req, res, next) => {
  next({ code: 404, message: "Resource not found" });
});

app.use((error, req, res, next) => {
  console.error("====== System Error Intercepted ======");
  console.error(error);

  let statusCode = typeof error.code === "number" ? error.code : 500;
  let data = error.data || null;
  let msg = error.message || "Internal server error";

  if (error instanceof Joi.ValidationError) {
    statusCode = 422;
    msg = "Validation Failed";
    data = {};
    error.details.forEach((e) => { data[e.context.label] = e.message; });
  }

  if (error.code === "23505") {
    statusCode = 400;
    msg = "Validation Failed: A record with this unique value already exists.";
    data = {};
    const match = error.detail?.match(/\((.*?)\)=\((.*?)\)/);
    if (match?.[1]) data[match[1]] = `${match[1]} must be completely unique`;
  }

  if (error.code === "22P02") {
    statusCode = 400;
    msg = "Database Constraint Error: Provided input type mapping or enum option value is invalid.";
  }

  res.status(statusCode).json({ result: data, message: msg, meta: null });
});

module.exports = app;