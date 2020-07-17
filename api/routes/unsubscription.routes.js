const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');

router.get('/:userId/:serverId', function (req, res) {
    const db = req.app.locals.db;
    const params = req.params;

    if (!params.userId || !params.serverId) {
        res.status(400).json("Request error");
    }

    db.collection('subscriptions').remove({ServerId: new mongodb.ObjectID(params.serverId), UserId: new mongodb.ObjectID(params.userId)}).then(r1 => {
        if (r1.result.ok === 1) {
            res.status(200).json({status: 1, message: `User successfully unsubscribed`});
        }
    });
});

module.exports = router;
