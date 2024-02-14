// Learnings
// Req from browser/client or resp to browser/client will always be STRING
// To avoid extra logic on route we use middlewares where  logic can be performed on input data set.
// Using next() of middle wares we can pass it particular router - adminAuth and userAuth in below routes 
// app.use(express.json()) vs app.use(bodyParser.json());




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

app.post('/admin/login', adminAuth, (req, res) => {
  res.json({ message: 'Admin logged in successfully' });
});

app.post('/admin/charachter', adminAuth, (req, res) => {
  var charachter = req.body
  const charachterId = Math.floor(Math.random() * 1000000000000000)
  charachter = { ...charachter, id: charachterId }
  // console.log(charachter)
  CHARACHTERS.push(charachter)
  res.json({ message: "Charachter added", characters: CHARACHTERS })
});

app.get('/admin/charachter/:charachterId', adminAuth, (req, res) => {
  const id = req.params.charachterId
  console.log(id)
  const charachter = CHARACHTERS.find(charachter => charachter.id === parseInt(id))
  if (charachter) return res.json({ charachter: charachter })
  res.json({ message: "invalid character id" })
});

app.get('/admin/charachters', adminAuth, (req, res) => {
  res.json({ charachters: CHARACHTERS })
});

// User routes
app.post('/users/signup', (req, res) => {
  const User = req.headers
  const isNewUser = USERS.find(user => user.username === User.username)
  if (isNewUser) return res.json({ message: "user exists" })
  USERS.push(User)
  res.json({ message: "user added successfully" })
});

app.post('/users/login', userAuth, (req, res) => {
  res.json({ message: 'User logged in successfully' });
});

app.get('/users/charachters', userAuth, (req, res) => {
  res.json({ charachters: CHARACHTERS })
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
