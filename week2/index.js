const express = require("express")
const bodyParser = require("body-parser")

const app = express()
const port = 3000
var numOfreq = 0

function middleware1(req, res, next) {
    numOfreq += 1
    console.log("from inside middleware ", req.headers.num)
    console.log(`number of request - ${numOfreq}`)
    if (req.headers.num || req.query.num || req.body.numgit) next()
    else res.send('bad request')
}

//Intercepts request comming from clients.
app.use(middleware1)
//To get body from client we need middleware bodyparser
app.use(bodyParser.json())


const calSum = (num) => {
    console.log(num)
    var sum = 0
    for (var i = 0; i <= num; i++) {
        sum += i
    }
    return sum
}

function callbackFunc(req, resp) {
    //Receving data from client using QUERY PARAM
    const num = req.query.num
    console.log(req.headers)
    //Receving data from client using body -  bodyParser ? body data : undefined
    console.log(req.body)
    const num3 = req.body.num
    //Receving data from client using HEADERS
    const num2 = req.headers.num
    console.log(num2)
    const total = calSum(num3 || num2 || num)
    const res = `Answer is ${total}`
    resp.send(res)
}

//Listen to incoming requests from client on port 3000 (*request handlers*)
app.get('/Answer', callbackFunc)
app.post('/', callbackFunc)


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})