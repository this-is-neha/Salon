# 📘 Salon Booking System - Backend Setup Guide

This guide explains how to set up the backend environment, configure the database, and run the application.

---

# 1. 📦 Prerequisites

Ensure you have the following installed:

- Node.js v24.13.0+
- PostgreSQL v17+
- Redis
- Ubuntu / WSL2 (recommended)

---

# 2. ⚙️ Environment Configuration

Create a `.env` file in the project root and configure the following:

```env
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
```

---

# 3. 🗄️ Database Setup (PostgreSQL)

## 📌 General Command Format

```bash
psql -U <username> -d <database_name> -f <file_path.sql>
```

---

## 📌 Step 1: Go to PostgreSQL bin directory (Windows example)

```bash
cd "C:\Program Files\PostgreSQL\17\bin"
```

---

## 📌 Step 2: Create Database

```bash
createdb -U postgres Ekbana
```

---

## 📌 Step 3: Run Schema File

```bash
psql -U postgres -d Ekbana -f "C:\Users\Asus\Desktop\Ekbana\database\schema.sql"
```

---

## 📌 Step 4: Run Seed Data

```bash
psql -U postgres -d Ekbana -f "C:\Users\Asus\Desktop\Ekbana\database\seed_data.sql"
```

---

## 💡 Alternative (Inside psql shell)

```bash
psql -U postgres -d Ekbana
```

Then run:

```sql
\i database/schema.sql
\i database/seed_data.sql
```

---

# 4. 🔴 Redis Setup (Ubuntu / WSL2)

## Start Redis Server

```bash
redis-server --daemonize yes
```

---

## Verify Redis Connection

```bash
redis-cli ping
```

Expected output:

```bash
PONG
```

---

# 5. 📄 Swagger Setup

Install Swagger dependencies:

```bash
npm install swagger-jsdoc swagger-ui-express
```

---

## Swagger Configuration

Create a file:

```bash
swagger.config.js
```

Add the following configuration:

```js
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
  apis: ["./src/modules/**/*.routes.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
```

---

## 📌 Access Swagger UI

```bash
http://localhost:9006/api-docs
```

---

# 6. 🚀 Running the Application

## Install Dependencies

```bash
npm install
```

---

## Start Backend Server

```bash
npm run dev
```

---

## Start Frontend

```bash
yarn run dev
```

---

# 🎯 Application URLs

## Backend API

```bash
http://localhost:9006
```

## Swagger Documentation

```bash
http://localhost:9006/api-docs
```

---

# ⚠️ Important Notes

- Never commit your `.env` file
- Use `.env.example` for sharing environment structure
- Ensure PostgreSQL and Redis are running before starting the server
- Regenerate secrets if credentials are exposed
