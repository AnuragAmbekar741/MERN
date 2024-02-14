const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminAuth = (req, res, next) => {
  const { username, password } = req.headers
  const admin = ADMINS.find(admin => admin.username === username && admin.password === password)
  if (admin) return next()
  if (!admin) return res.json({ message: "Wrong credentials" })
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  const { username, password } = req.headers
  const ifAdminExist = ADMINS.find(admin => admin.username === username)
  if (ifAdminExist) return res.status(403).json({ message: "Admin already exists!" })
  ADMINS.push({ username: username, password: password })
  return res.json({ message: "Admin created successfully!" })
});

app.post('/admin/login', (req, res) => {
  res.json({ message: 'Admin created successfully' });
});

app.post('/admin/courses', adminAuth, (req, res) => {
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
