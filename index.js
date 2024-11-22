const express = require("express");
const app = express();
const cors = require('cors');
const cookieparser = require("cookie-parser")

// imporing .env
require("dotenv").config();

// connection with mongo db 
const {connectDb} = require("./src/config/dbConnect")
connectDb()

// PORT
const port = process.env.PORT || 3100;

// middleware configuration
app.use(express.json());
app.use(cors({origin:true,credentials:true}))
app.use(cookieparser())

// startin route
app.get('/',(req,res) =>{
    res.json("Welcome to Backend the backbone")
})

// importing routes
// user auth routes
const UserAuthRoutes = require('./src/routes/UserAuthRoutes');
app.use('/api',UserAuthRoutes)

// role based and authorization routes
const UserAuthentication = require("./src/middleware/AuthMiddleware");
const RoleBasedAuthRoutes = require("./src/routes/RoleBasedRoutes")
app.use('/api',UserAuthentication,RoleBasedAuthRoutes)


app.listen(port, () => {
  console.log(`Application listening on ${port}`);
});
