var express = require('express');
var router = express.Router();
const Conn = require('../connection')
var config = require('../config/config.json')

var entity = Conn.import(__dirname + '/../models/employee.js'); 

router.get('/', function (req, res, next) {
    console.log("Read Operation Called")
    Conn.sync({ force: false }).then(() => {
        entity.findAll({ raw: true })
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


router.get('/:id', function (req, res, next) {
    console.log("Read Operation Called")
    Conn.sync({ force: false }).then(() => {
        entity.findByPk(req.params.id, { raw: true })
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



router.post("/", function (req, res, end) {
    let body = req.body
    console.log("Request Body incoming is: ", body)
    Conn.sync({ force: false }).then(() => {
        entity.create(body, { raw: true })
            .then(result => {
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
})


router.put("/:id",function(req,res,next){
    let body = req.body
    let id = req.params.id
    console.log("Request Body incoming is: ", body)
    Conn.sync({ force: false }).then(() => {
        entity.update(body, 
					{ where:{ id: id} },
                    { raw: true })
            .then(result => {
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                })
                res.end(JSON.stringify("Succesfully Updated"))
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

router.delete("/:id",function(req,res,next){
    let id = req.params.id
    Conn.sync({ force: false }).then(() => {
		entity.destroy({ where:{ id: id} },{ raw: true })
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

module.exports = router;