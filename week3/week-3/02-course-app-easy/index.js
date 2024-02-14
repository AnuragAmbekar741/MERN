const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let CHARACHTERS = [];

const adminAuth = (req, res, next) => {
  const { username, password } = req.headers
  const admin = ADMINS.find(admin => admin.username === username && admin.password === password)
  if (admin) return next()
  if (!admin) return res.json({ message: "Wrong credentials" })
}


const userAuth = (req, res, next) => {
  const { username, password } = req.headers
  const user = USERS.find(user => user.username === username && user.password === password)
  if (user) return next()
  if (!user) return res.json({ message: "Wrong credentials" })
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
  res.json({ message: 'Admin logged in successfully' });
});

app.post('/admin/charachter', adminAuth, (req, res) => {
  var charachter = req.body
  const charachterId = Math.floor(Math.random() * 1000000000000000)
  charachter = { ...newCourse, id: charachterId }
  // console.log(newCourse)
  CHARACHTERS.push(newCourse)
  res.json({ message: "Charachter added", characters: CHARACHTERS })
});

app.put('/admin/courses/:charachterId', adminAuth, (req, res) => {
  const id = req.params.charachterId
  const charachter = CHARACHTERS.find(charachter => charachter.id === id)
  if (charachter) return res.json({ charachter: charachter })
  res.json({ message: "invalid character id" })
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
});

app.post('/users/login', userAuth, (req, res) => {
  res.json({ message: 'User logged in successfully' });
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
