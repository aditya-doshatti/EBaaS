
router.get('/uniqueKey/:uniqueKey', function (req, res, next) {
    let uniqueKey = req.params.uniqueKey
    console.log("Read Operation Called")
    Conn.sync({ force: false }).then(() => {
        entity.findOne({where:{uniqueKey:uniqueKey}},{ raw: true })
            .then(result => {
                // console.log("entity is:-", result);
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                })
                res.end(JSON.stringify(result))
            })
            .catch(err => {
                res.writeHead(500, {
                    'Content-Type': 'application/json'
                })
                res.end(JSON.stringify(err))
            })
        // console.log("sync is completed")
    }).catch(err => {
        res.writeHead(500, {
            'Content-Type': 'application/json'
        })
        res.end(JSON.stringify(err))
    });
});

router.put("/uniqueKey/:uniqueKey",function(req,res,next){
    let body = req.body
    let uniqueKey = req.params.uniqueKey
    console.log("Request Body incoming is: ", body)
    Conn.sync({ force: false }).then(() => {
        entity.update(body, 
                    { returning: true, where:{ uniqueKey: uniqueKey} },
                    { raw: true })
            .then(result => {
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                })
                res.end(JSON.stringify("Successfully Updated"))
            })
            .catch(err => {
                res.writeHead(500, {
                    'Content-Type': 'application/json'
                })
                res.end(JSON.stringify(err))
            })
        // console.log("sync is completed")
    }).catch(err => {
        res.writeHead(500, {
            'Content-Type': 'application/json'
        })
        res.end(JSON.stringify(err))
    });
})

router.delete("/uniqueKey/:uniqueKey",function(req,res,next){
    let uniqueKey = req.params.uniqueKey
    Conn.sync({ force: false }).then(() => {
        entity.destroy({ where:{ uniqueKey: uniqueKey} },{ raw: true })
            .then(result => {
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                })
                res.end(JSON.stringify("Succesfully Deleted"))
            })
            .catch(err => {
                res.writeHead(500, {
                    'Content-Type': 'application/json'
                })
                res.end(JSON.stringify(err))
            })
        // console.log("sync is completed")
    }).catch(err => {
        res.writeHead(500, {
            'Content-Type': 'application/json'
        })
        res.end(JSON.stringify(err))
    });
})