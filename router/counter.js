const router = require('express').Router()
const redis = require('redis').createClient()

router.post("/increase", async (req, res) => {

    const result = {
        success: false,
        message: null
    }

    try {
        await redis.connect()
        const data = await redis.get("counter") // string collection의 명령어
        if (data) { 
            await redis.set("counter", parseInt(data) + 1) // 각각 key - value
        } else { // 데이터가 undefind 일때 
            await redis.set("counter", 1)
        }
        await redis.disconnect()

        result.success = true
        res.send(result)
    } catch {
        result.message = err.message
        res.send(result)
    }
})

router.post("/decrease", async (req, res) => {

    const result = {
        success: false,
        message: null
    }

    try {
        await redis.connect()
        const data = await redis.get("counter") // string collection의 명령어
        if (data) { 
            await redis.set("counter", parseInt(data) - 1) // 각각 key - value
        } else { // 데이터가 undefind 일때 
            await redis.set("counter", 1)
        }
        await redis.disconnect()

        result.success = true
        res.send(result)
    } catch {
        result.message = err.message
        res.send(result)
    }
})

router.get("/", async (req, res) => {
    
    const result = {
        success: false,
        message: null,
        data: null
    }

    try {
        await redis.connect()
        const data = await redis.get("counter") // string collection의 명령어
        await redis.disconnect()

        result.success = true
        result.data = data
        res.send(result)
    } catch {
        result.message = err.message
        res.send(result)
    }
})
module.exports = router