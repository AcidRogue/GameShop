const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');

router.get('/:messageId', function (req, res) {
    const db = req.app.locals.db;
    const params = req.params;

    db.collection('servers').findOne({_id: new mongodb.ObjectID(params.messageId)}).then(message => {
        if (message) {
            res.status(200).json(message);
        } else {
            res.status(404).json(`Message with id ${params.messageId} does not exist`);
        }
    })
})

router.post('/', function (req, res) {
    const db = req.app.locals.db;
    const body = req.body;

    const message = {
        CreatedDate: new Date().toISOString(),
        Content: body.Content
    };

    db.collection('users').findOne({_id: new mongodb.ObjectID(body.SenderId)}).then(user => {
        if(user){
            delete user.SubscribedServers;
            message.Sender = user;
            db.collection('servers').findOne({_id: new mongodb.ObjectID(body.ServerId)}).then(server => {
                if(server === 1){
                    message.Server = server;
                    delete message.Server.SubscribedUsers;
                    db.collection('messages').insertOne(message).then(r2 => {
                        if (r2.result.ok === 1) {
                            res.status(201).json(message);
                        } else {
                            res.status(500).json({message: "Problem with creating a message"});
                        }
                    })
                }
                else{
                    res.status(404).send("Server not found");
                }
            })
        }
        else{
            res.status(404).send("User not found");
        }
    });
})

module.exports = router;
