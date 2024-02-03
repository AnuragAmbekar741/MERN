// function callbackFun2(result2) {
//     console.log(result2)
// }
// function callbackFun(result) {
//     result.json().then(callbackFun2)
// }
fetch("http://localhost:3000/Answer?num=10", { method: "GET" }).then((resp) => {
    resp.json().then((resp) => {
        console.log(resp)
    })
})