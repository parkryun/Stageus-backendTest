const router = require('express').Router()
const redis = require('redis').createClient()

router.post("/increase", async (req, res) => {

    const itemName = req.body.item_name

    const result = {
        success: false,
        message: null
    }

    try {
        await redis.connect()
        const data = await redis.hGet("cart", itemName) //해쉬 get //  카트 뒤에 아이디 값을 같이 넣어주는거지  // cart는 key 아이템 네임은 서브키
        if (data) {
            await redis.hSet("cart", itemName, parseInt(data) + 1)
        } else {
            await redis.hSet("cart", itemName, 1)
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

    const itemName = req.body.item_name

    const result = {
        success: false,
        message: null
    }

    try {
        await redis.connect()
        const data = await redis.hGet("cart", itemName) //해쉬 get //  카트 뒤에 아이디 값을 같이 넣어주는거지  // cart는 key 아이템 네임은 서브키
        if (data) {
            await redis.hSet("cart", itemName, parseInt(data) - 1)
        } else {
            await redis.hSet("cart", itemName, 1)
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
        const data = await redis.hGetAll("cart")    // 카트가 있고 아이템 네임이 있고 개수가 있어 // json 전체를 가져오고싶어 > getall
        await redis.disconnect()

        result.success = true
        result.data = data
        res.send(result)
    } catch {
        result.message = err.message
        res.send(result)
    }
})

// 초기화
router.delete("/all", async (req, res) => {

    const result = {
        success: false,
        message: null
    }

    try {
        await redis.connect()
        await redis.del("cart") 
        await redis.disconnect()

        result.success = true
        res.send(result)
    } catch {
        result.message = err.message
        res.send(result)
    }
})

module.exports = router