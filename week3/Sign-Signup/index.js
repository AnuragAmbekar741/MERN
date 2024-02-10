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

app.post('/signup', (req, resp) => {
    const { email, password } = req.body
    if (!email || !password) return
    users.push({ email: email, password: password })
    console.log(email, password)
    resp.json({ message: "user added successfully" })
})

app.post('/signin', (req, resp) => {
    const { username, password, confirmpass } = req.body
    users.push({ username: username, password: password })
    resp.json({ message: "user added successfully" })
})

app.listen(port, () => console.log(`server running on ${port}`))