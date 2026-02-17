const express = require("express");
const dotenv = require("dotenv").config();
const dbConnect = require("./src/config/dbConnect")

dbConnect()
const app = express()

// middleware
app.use(express.json())

// routes

// start the port
const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})