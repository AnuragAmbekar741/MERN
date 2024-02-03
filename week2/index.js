const express = require("express")

const app = express()
const port = 3000

const calSum = (num) => {
    var sum = 0
    for (var i = 0; i <= num; i++) {
        sum += i
    }
    return sum
}

function callbackFunc(req, resp) {
    //Receving data from client using QUERY PARAM
    const num = req.query.num
    const total = calSum(num)
    const res = `Answer is ${total}`
    resp.send(res)
}

//Listen to incoming requests from client on port 3000
app.get('/Answer', callbackFunc)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})