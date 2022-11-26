const router = require("express").Router() // 라우터만 따로 임포트하는건데 메모리를 아낄 수 있으니까
const path = require("path")

// get //mainPage
router.get("/mainPage", (req, res) => {
    // res.sendFile(__dirname + "../mainPage.html")
    res.sendFile(path.join(__dirname, "../mainPage.html"))
})

module.exports = router // 파일 자체를 import가 아니라 파일 안에 특정 무언가를 import 하기 위해서 적어주는 것
