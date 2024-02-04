const express = require("express")
const bodyParser = require("body-parser");

const app = express()
const port = 3000

app.use(bodyParser.json())

var todos = []

const getAllTodos = (req, res) => {
    return res.send(todos)
}

const addTodo = (req, res) => {
    id = Math.floor(Math.random() * 100000)
    const todo = req.body
    const newtodo = { ...todo, id: id }
    todos.push(newtodo)
    res.send(todos)
}

app.get('/todos/:id', (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (!todo) {
        res.status(404).send();
    } else {
        res.json(todo);
    }
});

app.delete('/todos/:id', (req, resp) => {
    const todoIndex = todos.findIndex(t => t.id === parseInt(req.params.id));
    if (todoIndex === -1) resp.status(403).send("No todo found")
    else {
        todos.splice(todoIndex, 1)
        resp.send(todos)
    }
})

app.put('/todos/:id', (req, resp) => {
    const todoIndex = todos.findIndex(t => t.id === parseInt(req.params.id));
    if (todoIndex === -1) resp.status(403).send("No todo found")
    else {
        todos[todoIndex].title = req.body.title
        todos[todoIndex].description = req.body.description
        resp.json(todos[todoIndex])
    }
})

app.get('/todos', getAllTodos)
app.post('/addTodo', addTodo)

app.listen(port, () => console.log(`Server running on port ${port}`))