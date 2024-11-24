# Node.js Backend Assignment

A backend application built with Node.js, Express, and MongoDB for managing users, roles, teams, and tasks. It also includes real-time communication using Socket.IO and API documentation via Swagger.

---

## Getting Started

Follow the steps below to set up and run the project locally.

### Prerequisites

- **Node.js** (v14 or later)
- **MongoDB** (Local or Cloud)
- A text editor or IDE (e.g., VS Code)

---
installation

### 1. Clone the Repository
   ```bash
   git clone https://github.com/<your-username>/<repo-name>.git
   cd <repo-name>
2. Install Dependencies
npm install
3. Configure Environment Variables
Create a .env file in the root directory and add the following details:

env
ENV=Development
PORT=2024
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/BackendAssignment
JWT_SECRET=your-jwt-secret

SMTP_PORT=587
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-password
SMTP_SENDER=your-email@gmail.com
BASE_URL=http://localhost:2024
ADMIN_SECRET=your-admin-secret
Replace <username>, <password>, and other placeholders with your own values.

4. Run the Application
Start the server by running:

npm start
The application will be accessible at:
http://localhost:2024/api

API Documentation
API documentation is available at:
http://localhost:2024/api-docs

Project Overview
Authentication & Authorization: Secure JWT-based system.
Role Management: Assign and manage user roles.
Email Notifications: Integrated with NodeMailer for sending emails like account verification, password resets, and task updates.
Team & Task Management: Organize users into teams and manage tasks.
Real-Time Features: Socket.IO integration for live updates.
API Documentation: Swagger UI for interactive API exploration.
Author
👤 Saket Jha
📧 saketjha00@gmail.com
📱 +91 9709260818







