const express = require("express")
const bodyParser = require("body-parser")
const path = require('path');
const jwt = require("jsonwebtoken")

const app = express()
const port = 3000

app.use(bodyParser.json())

const users = []


app.get('/', (req, resp) => {
    resp.sendFile(path.join(__dirname + "/sign-in.html"))
})

app.get('/signup', (req, resp) => {
    resp.sendFile(path.join(__dirname + "/sign-up.html"))
})

app.listen(port, () => console.log(`server running on ${port}`))