const express = require("express");
const app = express();
const cors = require('cors');
const cookieparser = require("cookie-parser")
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// imporing .env
require("dotenv").config();

// connection with mongo db 
const { connectDb } = require("./src/config/dbConnect")
connectDb()

// PORT
const port = process.env.PORT || 3100;

// middleware configuration
app.use(express.json());
app.use(cors({ origin: true, credentials: true }))
app.use(cookieparser())

// starting route
app.get('/api', (req, res) => {
  res.json("Welcome to Backend the backbone")
})

// importing routes
// user auth routes
const UserAuthRoutes = require('./src/routes/UserAuthRoutes');
app.use('/api', UserAuthRoutes)


// user management routes
const UserManagementRoutes = require('./src/routes/UserManagementRoutes');
const UserAuthentication = require("./src/middleware/AuthMiddleware");
app.use('/api', UserAuthentication, UserManagementRoutes)


// roles assignment routes
const RoleRoutes = require("./src/routes/RoleRoutes")
app.use('/api', UserAuthentication, RoleRoutes)

// team routes
const TeamRoutes = require("./src/routes/TeamRoutes")
app.use('/api', UserAuthentication, TeamRoutes)

// task routes
const TaskRoutes = require("./src/routes/TaskRoutes")
app.use('/api', UserAuthentication, TaskRoutes)

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node.js Backend Assignment",
      version: "1.0.0",
      description: "A backend API for managing users, roles, teams, and tasks.",
      contact: {
        name: "Saket Jha",
        email: "saketjha00@gmail.com",
        contact: 9709260818
      },
    },
    servers: [
      {
        url: "http://localhost:3100/api",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "token",
          in: "cookie",
          name: "Authtoken",
          description: "Authentication cookie containing the user's session token.",
        },
      },
    },
    security: [{ cookieAuth: [] }],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(port, () => {
  console.log(`Application listening on ${port}`);
});
