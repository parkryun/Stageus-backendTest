const router = require("express").Router()
const { Client } = require("pg") // postgre import
const jwt = require('jsonwebtoken')

// post /account/login
router.post("/login", async (req, res) => {

    const idValue = req.body.id_value
    const pwValue = req.body.pw_value

    const result = {
        "success": false,
        "message": "",
        "token": null
    }

    // PostgreSQL 기본 설정 ( DB 계정 설정)
    const client = new Client({ // =위에 있는 Client를 받는데 
        user: "ubuntu",
        password: "1234",
        host: "localhost",
        database: "stageus",
        port: 5432
    })
 
    try {
        await client.connect() // await 붙여주는
        
        const sql = "SELECT * FROM backend.account WHERE id=$1 and pw=$2;" // ? 대신 $로 대체 
        const values = [idValue, pwValue]
    
        const data = await client.query(sql, values) // await 앞에 변수를 붙여주는거지
        const row = data.rows

        if (row.length > 0) { // 로그인 성공
            result.success = true

            const jwtToken = jwt.sign(
                { 
                    "id": idValue
                }, 
                process.env.SECRET_KEY, 
                {
                    "expiresIn": "1m",
                    "issuer": "stageus"
                }
            ) 
            result.token = jwtToken
        } else {
            result.message = "회원정보가 잘못됐습니다."
        }
        res.send(result)
    } catch(err) {
        result.message = err
        res.send(result)
    }
})

// POST /account/autoLogin 자동 로그인 api
router.post("/autoLogin", async (req, res) => {

    const token = req.body.token
    
    const result = {
        "success": false,
        "message": ""
    }

    try {
        jwt.verify(token, process.env.SECRET_KEY)
        result.success = true
    } catch(err) {
        result.message = err.message
    }
    res.send(result)
})

// get /account/account 이거니까 account를 지워주는거야 그냥 /로만
router.get("/", (req, res) => {
    
})

// 이것도 post
router.post("/", (req, res) => {
    
})

module.exports = router