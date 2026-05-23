📘 Salon Booking System - Backend Setup Guide

This guide explains how to set up the backend environment, configure the database, and run the application.

1. 📦 Prerequisites

Ensure you have the following installed:

Node.js v24.13.0+
PostgreSQL v17+
Redis
Ubuntu / WSL2 (recommended)
2. ⚙️ Environment Configuration

Create a .env file in the project root and configure the following:

PORT=9006

DB_USER=postgres
DB_PASSWORD=your_db_password_here
DB_HOST=localhost
DB_PORT=5432
DB_NAME=Ekbana

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password_here

BACKEND_API_URL=http://localhost:9006
FRONTEND_URL=http://localhost:5173

JWT_SECRET=your_jwt_secret_here
3. 🗄️ Database Setup (PostgreSQL)
📌 General Command Format
psql -U <username> -d <database_name> -f <file_path.sql>
📌 Step 1: Go to PostgreSQL bin directory (Windows example)
cd "C:\Program Files\PostgreSQL\17\bin"
📌 Step 2: Create Database (if not exists)
createdb -U postgres Ekbana
📌 Step 3: Run Schema File
psql -U postgres -d Ekbana -f "C:\Users\Asus\Desktop\Ekbana\database\schema.sql"
📌 Step 4: Run Seed Data
psql -U postgres -d Ekbana -f "C:\Users\Asus\Desktop\Ekbana\database\seed_data.sql"
💡 Alternative (Inside psql shell)
psql -U postgres -d Ekbana

Then run:

\i database/schema.sql
\i database/seed_data.sql
4. 🔴 Redis Setup (Ubuntu / WSL2)
Start Redis Server
redis-server --daemonize yes
Verify Connection
redis-cli ping

Expected output:

PONG
5. 📄 Swagger Setup

Install Swagger dependencies:

npm install swagger-jsdoc swagger-ui-express
Swagger Configuration (Express Example)

Create a file:

swagger.config.js
Example setup:
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Salon Booking System API",
      version: "1.0.0",
      description: "API documentation for Salon Booking System",
    },
    servers: [
      {
        url: "http://localhost:9006",
      },
    ],
  },
  apis: ["./src/modules/**/*.routes.js"], // adjust path if needed
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
📌 Access Swagger UI

Once server is running:

http://localhost:9006/api-docs
6. 🚀 Running the Application
Install dependencies
npm install
Start Backend Server
npm run dev
Start Frontend (if applicable)
yarn run dev
🎯 Final Output

Backend API:

http://localhost:9006

Swagger Docs:

http://localhost:9006/api-docs
