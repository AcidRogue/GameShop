const express = require('express');
const router = express.Router();
const indicative = require('indicative').validator;
const mongodb = require('mongodb');

router.get('/', function (req, res) {
    const db = req.app.locals.db;

    db.collection('servers').find({}).project({SubscribedUsers: 0}).toArray().then(results => {
        res.status(200).send(results);
    })
});

router.get('/:serverId', function (req,res) {
    const db = req.app.locals.db;
    const params = req.params;

    db.collection('servers').findOne({_id: new mongodb.ObjectID(params.serverId)}).then(server =>{
        if(server){
            res.status(200).json(server);
        }
        else{
            res.status(404).json(`Server with id ${params.serverId} does not exist`);
        }
    })
})

router.post('/', function (req, res) {
    const db = req.app.locals.db;
    const server = req.body;
    server.CreatedDate = new Date().toISOString();
    indicative.validate(server, {
        Name: 'required|max:20',
        Description: 'string',
        CreatedDate: 'string',
        SubscribedUsers: 'required|array',
        ServerImage: 'required|string'
    }).then(() => {
        const collection = db.collection('servers');

        collection.insertOne(server).then(result => {
            if (result.result.ok === 1) {
                res.status(201).json({server: server, message: "Created new server"});
            } else {
                res.status(500).json({message: "Problem with creating a server"});
            }
        })
    }).catch(errors => {
        res.status(500).json({errors: errors})
    });
});

module.exports = router;
