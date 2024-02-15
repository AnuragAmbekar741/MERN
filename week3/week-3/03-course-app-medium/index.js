const express = require('express');
const jwt = require('jsonwebtoken')
const fs = require("fs")
const app = express();


app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const SECRET = "S#C#RETKEY"

try {
  ADMINS = JSON.parse(fs.readFileSync('admin.json', 'utf-8'))
  USERS = JSON.parse(fs.readFileSync('user.json', 'utf-8'))
  COURSES = JSON.parse(fs.readFileSync('courses.json', 'utf-8'))

} catch (e) {
  ADMINS = []
  USERS = []
  COURSES = []
}

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (authHeader) {
    const token = authHeader.split(' ')[1]
    jwt.verify(token, SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: "Invalid user" })
      req.user = user
      next()
    })
  } else return res.json({ message: "Invalid user" })
}


// Admin routes
app.post('/admin/signup', (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(403).json({ message: "Missing credentials" })
  const adminExist = ADMINS.find(ele => ele.username === username)
  if (adminExist) return res.status(403).json({ message: "Admin already exists" })
  if (!adminExist) {
    ADMINS.push({ username: username, password: password })
    fs.writeFileSync('admin.json', JSON.stringify(ADMINS))
    const token = jwt.sign({ username, role: 'Admin' }, SECRET, { expiresIn: "1h" })
    res.json({ message: "Admin created successfully", token: token })
  }
});

app.post('/admin/login', (req, res) => {
  const { username, password } = req.headers;
  if (!username || !password) return res.status(403).json({ message: "username or pass missing" })
  const admin = ADMINS.find(a => a.username === username && a.password === password);
  if (admin) {
    const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'Invalid username or password' });
  }

});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
});

app.post('/users/login', (req, res) => {
  // logic to log in user
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
