const router = require("express").Router()
const elastic = require("elasticsearch")

// 게시물 작성 api
router.post("/", async (req, res) => {

    const author = req.body.author
    const title = req.body.title
    const content = req.body.content

    const result = {
        "success": false,
        "message": null
    }

    // postgreSQL에 게시글 데이터 넣는 내용


    // elasticsearch에 게시글 데이터 넣는 내용
    try {
        const connect = new elastic.Client({
            "node": "http://localhost:9200/" // 노드 하나만 쓸꺼니까 노드 이름 적을 필요 없겠지?
        })    
        await connect.index({   // 데이터 넣어주는 함수 
            "index": "board",
            "body": {   // 여기부터가 document
                "author": author,       // 이거 하나하나가 field
                "title": title,
                "content": content
            }
        })
        result.success = true
        res.send(result)
    } catch (err) {
        result.message = err.message
        res.send(result)
    }

})

// 게시물 삭제 api
router.delete("/", async (req, res) => {

    // postgreSQL에 게시글 데이터 삭제 내용
    // elasticsearch에 게시글 데이터 삭제 내용
})

// 게시물 목록 가져오는 api
router.get("/", async (req, res) => {

    //postgresql 만 사용해서 게시물 가져오는 내용
})

// 게시물 목록을 검색해서 가져오는 api
router.get("/search", async (req, res) => {

    const keyword = req.query.keyword

    const result = {
        "success": false,
        "message": null,
        "data": null
    }

    // elasticsearch만 사용해서 게시글 검색 목록을 가져오는 내용 
    try {
        const connect = new elastic.Client({
            "node": "http://localhost:9200/" // 노드 하나만 쓸꺼니까 노드 이름 적을 필요 없겠지?
        })  

        const searchResult = await connect.search({
            "index": "board",
            "body": {
                "query": {  // 이러이러한 조건으로 검색하겠다.
                    "match": {
                        "title": keyword
                    }
                }
            }
        })

        result.success = true
        result.data = searchResult.hits.hits // 이걸 프론트로 보내주는거야 프론트에서 쓰는 값은 이거니까
        res.send(result)
    } catch (err) {
        result.message = err.message
        res.send(result)
    }
})

module.exports = router