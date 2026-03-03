const express = require("express");
const dotenv = require("dotenv").config();
const dbConnect = require("./src/config/dbConnect")
const authRoutes = require("./src/routes/authRoutes")

dbConnect()
const app = express()

// middleware
app.use(express.json())

// routes
app.get("/",(req,res)=>{
    res.send("Backend is prepairing for ContracthubPK")
})
app.use("/api/auth",authRoutes)

// start the port
const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})