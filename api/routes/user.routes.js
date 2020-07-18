const express = require('express');
const router = express.Router();
const indicative = require('indicative').validator;
const mongodb = require('mongodb');
const bcrypt = require('bcrypt');

router.get('/', function (req, res) {
    const db = req.app.locals.db;

    db.collection('users').find().toArray().then(results => {
        res.send(results);
    })
});

router.get('/:userId', function (req, res) {
    const db = req.app.locals.db;
    const params = req.params;

    db.collection('users').findOne({_id: new mongodb.ObjectID(params.userId)}).then(user => {
        if (user) {
            user.SubscribedServers = [];
            db.collection('subscriptions').find({UserId: new mongodb.ObjectID(params.userId)}).toArray().then(servers => {
                let ids = [];
                for (let i = 0; i < servers.length; i++) {
                    ids.push(servers[i].ServerId);
                }
                db.collection('servers').find({
                    _id: {
                        $in: ids
                    }
                }).toArray().then(result => {
                    if (result) {
                        user.SubscribedServers = result;
                        res.status(200).json(user);
                    }
                })
            })
        } else {
            res.status(404).json(`User with id ${params.userId} does not exist`);
        }
    })
});

router.post('/', function (req, res) {
    const db = req.app.locals.db;
    const user = req.body;
    indicative.validate(user, {
        Email: 'required|email',
        Username: 'required|string',
        Password: 'required|string|min:2|max:20',
        FirstName: 'string',
        LastName: 'string'
    }).then(() => {
        const collection = db.collection('users');

        collection.findOne({Email: user.Email}).then(existingUser => {
            if (existingUser) {
                res.status(303).json("User with this email already exists")
            } else {
                user.Password = bcrypt.hashSync(user.Password, 10);
                user.CreatedDate = new Date().toISOString();
                collection.insertOne(user).then(result => {
                    if (result.result.ok === 1) {
                        res.status(201).json({user: result.ops[0], message: "Created new user"});
                    } else {
                        res.status(500).json({message: "Problem with creating a user"});
                    }
                });
            }
        })
    }).catch(errors => {
        res.status(500).json({errors: errors})
    });
})
;

router.put('/:userId', function (req, res) {
    const db = req.app.locals.db;
    const user = req.body;
    const userId = req.params.userId;

    const collection = db.collection('users');

    collection.findOne({Email: user.Email}).then(existingUser => {
        if (existingUser && userId != existingUser._id) {
            res.status(303).json("User with this email already exists")
        } else {
            collection.updateOne({_id: new mongodb.ObjectID(userId)}, {$set: user}).then(result => {
                if (result.result.ok === 1) {
                    res.status(200).json({message: `Updated user with id ${user._id}`});
                } else {
                    res.status(500).json({message: `Problem with updating user ${user._id}`});
                }
            })
        }
    })
});

module.exports = router;
