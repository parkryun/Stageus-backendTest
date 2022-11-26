const router = require("express").Router()
const mongoClient = require("mongodb").MongoClient

router.post("/", async (req, res) => {

    const itemName = req.body.name
    const itemNumber = req.body.number
    const itemExplain = req.body.explain

    const result = {
        success: false
    }

    try {
        const database = await mongoClient.connect("mongodb://localhost:27017")
        const data = {
            "item_name": itemName,
            "item_number": itemNumber,
            "item_explain": itemExplain
        }
        await database.db("stageus").collection("backend").insertOne(data)
        database.close() // 이거는 종료하는거 꼭 넣어줘야함

        result.success = true
        res.send(result)
    } catch(err) {
        console.log(err.message)
        res.send(result)
    }
})

module.exports = router