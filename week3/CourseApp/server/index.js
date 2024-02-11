const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require('dotenv').config();


const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGOOSE_URL, { useNewUrlParser: true, useUnifiedTopology: true, dbName: "CourseApp" })
app.listen(port, () => console.log(`Server running on port ${port}`))