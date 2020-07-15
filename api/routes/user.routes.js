const express = require('express');
const router = express.Router();
const indicative = require('indicative').validator;
const mongodb = require('mongodb');

router.get('/', function (req, res) {
    const db = req.app.locals.db;

    db.collection('users').find().toArray().then(results => {
        res.send(results);
    })
});

router.get('/:userId', function (req, res) {
    const db = req.app.locals.db;
    const params = req.params;

    db.collection('users').findOne({_id: new mongodb.ObjectID(params.userId)}, {projection: {Password: 0}}).then(user => {
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json(`User with id ${params.userId} does not exist`);
        }
    })
})

router.post('/', function (req, res) {
    const db = req.app.locals.db;
    const user = req.body;
    indicative.validate(user, {
        Email: 'required|email',
        Username: 'required|string',
        Password: 'required|string|min:2|max:20',
        FirstName: 'string',
        LastName: 'string',
        Role: 'required',
        SubscribedServers: 'required|array'
    }).then(() => {
        const collection = db.collection('users');

        collection.findOne({Email: user.Email}).then(existingUser => {
            if (existingUser) {
                res.status(303).json("User with this email already exists")
            } else {
                user.CreatedDate = new Date().toISOString();
                collection.insertOne(user).then(result => {
                    if (result.result.ok === 1) {
                        res.status(201).json({user: result.ops[0], message: "Created new user"});
                    } else {
                        res.status(500).json({message: "Problem with creating a user"});
                    }
                })
            }
        })
    }).catch(errors => {
        res.status(500).json({errors: errors})
    });
});

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
                    res.status(20).json({message: `Updated user with id ${user._id}`});
                } else {
                    res.status(500).json({message: `Problem with updating user ${user._id}`});
                }
            })
        }
    })
})
;

/*// DELETE users list
router.delete('/:userId', function (req, res) {
    const db = req.app.locals.db;
    const params = req.params;
    indicative.validate(params, {userId: 'required|regex:^[0-9a-f]{24}$'})
        .then(() => {
            db.collection('users', function (err, users_collection) {
                if (err) throw err;
                users_collection.findOneAndDelete({_id: new mongodb.ObjectID(params.userId)},
                    (err, result) => {
                        if (err) throw err;
                        if (result.ok) {
                            replaceId(result.value);
                            res.json(result.value);
                        } else {
                            error(req, res, 404, `User with Id=${params.userId} not found.`, err);
                        }
                    });
            });
        }).catch(errors => {
        error(req, res, 400, 'Invalid user ID: ' + util.inspect(errors))
    });
});
*!/*/


module.exports = router;
