const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');

router.get('/:messageId', function (req, res) {
    const db = req.app.locals.db;
    const params = req.params;

    db.collection('messages').aggregate([
        {
            $lookup: {
                from: 'servers',
                localField: 'ServerId',
                foreignField: '_id',
                as: 'Server'
            }
        },
        {
            $unwind: "$Server"
        },
        {
            $lookup: {
                from: 'users',
                localField: 'SenderId',
                foreignField: '_id',
                as: 'User'
            }
        },
        {
            $unwind: "$User"
        }
    ]).toArray().then(message => {
        if (message) {
            res.status(200).json(message);
        } else {
            res.status(404).json(`Message with id ${params.messageId} does not exist`);
        }
    })
});

router.post('/', function (req, res) {
    const db = req.app.locals.db;
    const body = req.body;

    const message = {
        SenderId: mongodb.ObjectID(body.SenderId),
        ServerId: mongodb.ObjectID(body.ServerId),
        CreatedDate: new Date().toISOString(),
        Content: body.Content
    };

    db.collection('users').findOne({_id: new mongodb.ObjectID(body.SenderId)}).then(user => {
        if (user) {
            db.collection('servers').findOne({_id: new mongodb.ObjectID(body.ServerId)}).then(server => {
                if (server) {
                    db.collection('messages').insertOne(message).then(r2 => {
                        if (r2.result.ok === 1) {
                            res.status(201).json(message);
                        } else {
                            res.status(500).json({message: "Problem with creating a message"});
                        }
                    })
                } else {
                    res.status(404).send("Server not found");
                }
            })
        } else {
            res.status(404).send("User not found");
        }
    });
});

router.put('/:messageId', function (req, res) {
    const db = req.app.locals.db;
    const body = req.body;
    const messageId = req.params.messageId;

    db.collection('messages').findOneAndUpdate({_id: new mongodb.ObjectID(messageId)}, {
        $set: {
            Content: body.Content
        }
    }).then(message => {
        if (message.ok === 1 && message.lastErrorObject.updatedExisting) {
            res.status(200).json();
        }
    });
});

router.delete('/:messageId', function (req, res) {
    const db = req.app.locals.db;
    const messageId = req.params.messageId;

    db.collection('messages').remove({_id: new mongodb.ObjectID(messageId)}).then(result => {
        if(result.result.ok){
            res.status(200).json();
        }
    })
})

module.exports = router;
