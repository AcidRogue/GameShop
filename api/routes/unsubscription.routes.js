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
            db.collection('servers').findOne({_id: new mongodb.ObjectID(params.serverId)}).then(server => {
                if(server){
                    db.collection('users').updateOne({_id: new mongodb.ObjectID(params.userId)}, {$pull: {SubscribedServers: {_id: server._id}}}).then(r1 =>{
                        if(r1.result.ok === 1){
                            db.collection('servers').updateOne({_id: new mongodb.ObjectID(params.serverId)}, {$pull: {SubscribedUsers: {_id: user._id}}}).then(r2 =>{
                                if(r2.result.ok === 1){
                                    res.status(200).json({status: 1, message: `User ${user.Username} successfully unsubscribed from ${server.Name}`});
                                }
                                else{
                                    res.status(500).json("Problem with unsubscribing from the server");
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
