const express = require("express")

const app = express()
const port = 3000

const calSum = (num) => {
    var sum = 0
    for (var i = 0; i < num; i++) {
        sum += i
    }
    return sum
}

function callbackFunc(req, resp) {
    const total = calSum(100)
    const res = `Answer is ${total}`
    resp.send(res)
}

app.get('/Answer', callbackFunc)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})