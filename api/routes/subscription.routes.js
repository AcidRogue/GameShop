const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');

router.get('/:userId/:serverId', function (req,res) {
    const db = req.app.locals.db;
    const params = req.params;

    if(!params.userId || !params.serverId){
        res.status(400).json("Request error");
    }

    db.collection('users').findOne({_id: new mongodb.ObjectID(params.userId)}).then(user => {
        if(user){
            delete user.SubscribedServers;
            db.collection('servers').findOne({_id: new mongodb.ObjectID(params.serverId)}).then(server => {
                if(server){
                    delete server.SubscribedUsers;
                    db.collection('users').updateOne({_id: new mongodb.ObjectID(params.userId)}, {$addToSet: {SubscribedServers: server}}).then(r1 =>{
                        if(r1.result.ok === 1){
                            db.collection('servers').updateOne({_id: new mongodb.ObjectID(params.serverId)}, {$addToSet: {SubscribedUsers: user}}).then(r2 =>{
                                if(r2.result.ok === 1){
                                    res.status(200).json(`User ${user.Username} successfully subscribed to ${server.Name}`);
                                }
                                else{
                                    res.status(500).json("Problem with subscribing to the server");
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;
