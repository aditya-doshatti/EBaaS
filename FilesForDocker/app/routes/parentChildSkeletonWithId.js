
router.get('/:id/childTable', function (req, res, next) {
    var childEntity = Conn.import(__dirname + `/../models/${config.YOUR_TABLE_NAME}.js`);
    let id = req.params.id
    Conn.sync({ force: false }).then(() => {
        childEntity.findAll({where:{foreignKey:id}},{ raw: true })
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

router.post('/:id/childTable', function (req, res, next) {
    var childEntity = Conn.import(__dirname + `/../models/${config.YOUR_TABLE_NAME}.js`);
    let id = req.params.id
    let body = req.body
    body['foreignKey'] = id
    Conn.sync({ force: false }).then(() => {
        childEntity.create(body,{ raw: true })
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