const express = require("express")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

const app = express()

app.use(express.json())


mongoose.connect()

app.listen(3000, () => console.log(`Server running on port 3000`))

