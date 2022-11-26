const express = require("express")
const app = express()
const port = 3000

const https = require("https")
const path = require("path")
const fs = require("fs") // file system
const options = {
    key: fs.readFileSync(path.join(__dirname, "/ssl/key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "/ssl/cert.pem")),
    passphrase: "1234" // 원래 ca 넣는 곳임.
}
const httpsPort = 3443

app.use(express.json()) // 받는 string 데이터를 json으로 변환 & 보내는 json을 자동으로 string으로 변환
require("dotenv").config()

app.get("*", (req, res, next) => { // * > 모든 api호출을 대상으로 라는 뜻 / next는 밑으로 내려가

    const protocol = req.protocol // 접속한 프론트엔드가 http로 왔는지 https로 왔는지 알 수 있음
    console.log(protocol)

    if (protocol == "http") {
        const destination = "https://" + req.hostname + ":3443" + req.url // hostname:사용자가 요청한 도메인값이 쭉 적힘
        res.redirect(destination)
    } else {
        next() // 그냥 넘어가게 
    }
})

const pagesApi = require("./router/pages.js")
app.use("/", pagesApi)

const accountApi = require("./router/account.js")
app.use("/account", accountApi)

const inventoryApi = require("./router/inventory.js")
app.use("/inventory", inventoryApi)

app.listen(port, () => {
    console.log(`${port} 번에서 웹 서버 시작`)
}) // http로 여는 방법

https.createServer(options, app).listen(httpsPort, () => {
    console.log(`${httpsPort} 번에서 웹 서버 시작`) // https로 여는 방법
})