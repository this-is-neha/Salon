Salon Booking System - Backend Setup Guide
This guide provides the necessary steps to set up your environment, initialize the database, and run the backend.

1. Prerequisites
Node.js (v24.13.0+)

PostgreSQL (v17+)

Redis

Ubuntu/WSL2

2. Environment Configuration
Create a .env file in your project root directory and copy the following configuration. Ensure you update the placeholder values with your actual credentials:

Code snippet
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

3. Database Setup (PostgreSQL)
To ensure the system works, you must initialize the database using the PostgreSQL bin directory.

A. Create and Import Schema
Replace database name  with Ekbana as in environment  vaibale I have set it to Ekbana 
Generalized: psql -U <username> -d <database_name> -f <file_path.sql>

Run this command from your terminal where sql is there:
For eg: cd "C:\Program Files\PostgreSQL\17\bin" 
Then run :
psql -U postgres -d Ekbana -f "C:\Users\Asus\Desktop\Ekbana\database\schema.sql"
psql -U postgres -d Ekbana -f "C:\Users\Asus\Desktop\Ekbana\database\seed_data.sql"

4. Redis Configuration (Ubuntu/WSL2)
Your system relies on Redis for handling background tasks:

Start the Redis server:

Bash
redis-server --daemonize yes
Verify the connection:

Bash
redis-cli ping
Expect a response of PONG.

5. Running the Application
After configuring the environment and database:

Install dependencies:

Bash
npm install
Start the server:

Bash
Client: yarn run dev
Server: npm run dev
Your API will be live at http://localhost:9006.
