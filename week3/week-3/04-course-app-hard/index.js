const express = require('express');
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(express.json());


const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }]
})

const adminSchema = new mongoose.Schema({
  username: { type: String, require: true },
  password: String,
})

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean
})

const user = mongoose.model("User", userSchema)
const admin = mongoose.model("Admin", adminSchema)
const course = mongoose.model("Course", courseSchema)

mongoose.connect(process.env.MONGOOSE_URL, { useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" });

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(403).json({ message: 'Invalid request' })
  const token = authHeader.split(' ')[1]
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid request' })
    if (user) {
      req.user = user
      next()
    }
  })
}


app.post('/admin/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password are required." });
  try {
    const adminExist = await admin.findOne({ username: username });
    if (adminExist) return res.status(403).json({ message: "Admin already exists." });
    const newAdmin = new admin({ username, password });
    await newAdmin.save();
    const token = jwt.sign({ username, role: 'admin' }, process.env.SECRET_KEY, { expiresIn: '1h' })
    return res.status(201).json({ message: "Admin created successfully.", token: token });
  } catch (error) {
    console.error("Error occurred during admin signup:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ message: "Username and password are required." });
  const user = await admin.findOne({ username, password })
  if (!user) return res.status(400).json({ message: "Invalid username or password" });
  const token = jwt.sign({ username, role: 'admin' }, process.env.SECRET_KEY, { expiresIn: "1h" })
  return res.json({ message: "Admin logged in successfully.", token });
});

app.post('/admin/courses', authenticateJwt, async (req, res) => {
  const newCourse = req.body
  const addCourse = new course(newCourse)
  await addCourse.save()
  res.json({ message: "New course added", courseId: newCourse.id })
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
