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
  course_name: { type: String, required: true },
  course_description: { type: String, required: true },
  instructor: { type: String, required: true },
  duration: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true }
})

const user = mongoose.model("User", userSchema)
const admin = mongoose.model("Admin", adminSchema)
const course = mongoose.model("Course", courseSchema)


// mongoose.connect(process.env.MONGOOSE_URL, { useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" });

mongoose.connect(process.env.MONGOOSE_URL, { dbName: "courses" });


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
  console.log(process.env.MONGOOSE_URL)
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
  console.log(newCourse)
  const addCourse = new course(newCourse)
  await addCourse.save()
  res.json({ message: "New course added", courseId: addCourse._id })
});

app.put('/admin/courses/:courseId', authenticateJwt, async (req, res) => {
  const updatedCourse = await course.findByIdAndUpdate(req.params.courseId, req.body, { new: true })
  if (updatedCourse) return res.json({ message: "Course updated" })
  else return res.json({ message: "Cannot find course to update" })
});

app.get('/admin/courses', async (req, res) => {
  const allCourses = await course.find({})
  res.json({ allCourses })
});

// User routes
app.post('/users/signup', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ message: "Username and password are required." });
  const userExists = await user.findOne({ username })
  if (userExists) return res.status(400).json({ message: "Username taken" });
  else {
    const newUser = new user({ username, password })
    await newUser.save()
    const token = jwt.sign({ username, role: "user" }, process.env.SECRET_KEY)
    return res.json({ message: "User created successfully", token })
  }
})

app.post('/users/login', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ message: "Username and password are required." });
  const isUser = await user.findOne({ username, password })
  if (isUser) {
    const token = jwt.sign({ username, role: "user" }, process.env.SECRET_KEY)
    return res.json({ message: "User logged in successfully", token })
  }
  else return res.json({ message: "Invalid username or password" });
});

app.get('/users/courses', async (req, res) => {
  const allCourses = await course.find({})
  res.json({ allCourses })
});

app.post('/users/courses/:courseId', authenticateJwt, async (req, res) => {
  const courseExists = await course.findById(req.params.courseId)
  if (courseExists) {
    const isUser = await user.findOne({ username: req.user.username })
    if (isUser) {
      isUser.purchasedCourses.push(courseExists)
      await isUser.save()
      return res.json({ message: "Courses successfully bought", course: courseExists })
    }
    else return res.json({ message: "Invalid request" })
  }
  else return res.json({ message: "Invalid request" })
});

app.get('/users/purchasedCourses', authenticateJwt, async (req, res) => {
  const isUser = await user.findOne({ username: req.user.username })
  if (isUser) return res.json({ courses: isUser.purchasedCourses })
  else return res.json({ message: "Invalid request" })
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
