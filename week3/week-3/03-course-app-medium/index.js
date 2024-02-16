const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken')
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const SECRET = "S#CR3T"

try {
  ADMINS = JSON.parse(fs.readFileSync('admin.json', 'utf8'))
  USERS = JSON.parse(fs.readFileSync('user.json', 'utf8'))
  COURSES = JSON.parse(fs.readFileSync('courses.json', 'utf8'))

} catch {
  ADMINS = []
  USERS = []
  COURSES = []
}


const authJwt = (req, res, next) => {
  const auth = req.headers.authorization
  if (!auth) return res.status(403).json({ message: "invalid request" })
  if (auth) {
    const token = auth.split(" ")[1]
    jwt.verify(token, SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: "invalid request" })
      req.user = user
      next()
    })
  }

}




// Admin routes
app.post('/admin/signup', (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(403).json({ message: "invalid request" })
  const adminExists = ADMINS.find(a => a.username === username)
  if (adminExists) return res.status(403).json({ message: "admin already exist" })
  if (!adminExists) {
    ADMINS.push({ username, password })
    const token = jwt.sign({ username, role: "Admin" }, SECRET)
    return res.json({ message: "admin created!", token: token })
  }
});

app.post('/admin/login', (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(403).json({ message: "invalid request" })
  const admin = ADMINS.find(a => a.username === username && a.password === password)
  if (!admin) return res.status(403).json({ message: "invalid request" })
  if (admin) {
    const token = jwt.sign({ username, role: "Admin" }, SECRET)
    return res.json({ message: "admin logged in!", token: token })
  }
});

app.post('/admin/courses', authJwt, (req, res) => {
  var newCourse = req.body
  const courseId = Math.floor(Math.random() * 10000)
  newCourse = { ...newCourse, courseId: courseId }
  COURSES.push(newCourse)
  fs.writeFileSync('courses.json', JSON.stringify(COURSES))
  res.json({ message: "Course added successfully", course: newCourse })
});

app.put('/admin/courses/:courseId', authJwt, (req, res) => {
  const id = req.params.courseId
  const updatedCourse = req.body
  const course = COURSES.find(c => c.courseId === parseInt(id))
  if (!course) return res.status(403).json({ message: "invalid course id" })
  if (course) {
    Object.assign(course, updatedCourse)
    fs.writeFileSync('courses.json', JSON.stringify(COURSES))
    return res.json({ message: 'Course updated successfully' });
  }
});

app.get('/admin/courses', authJwt, (req, res) => {
  res.json({ courses: COURSES })
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