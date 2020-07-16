const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');

router.post('/', function (req, res) {
    const db = req.app.locals.db;
    const body = req.body;

    let searchObj = {};
    if(body.ServerId){
        searchObj.ServerId = new mongodb.ObjectID(body.ServerId);
    }
    if(body.SenderId){
        searchObj.SenderId = new mongodb.ObjectID(body.SenderId);
    }
    if(body.Content){
        searchObj.Content = new RegExp([".*", body.Content, ".*"].join(""), 'ig');
    }

    db.collection('messages').aggregate([
        {
            $match: searchObj
        },
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
                as: 'Sender'
            }
        },
        {
            $unwind: "$Sender"
        }
    ]).toArray().then(message => {
        if (message) {
            res.status(200).json(message);
        }
    })
});

module.exports = router;
