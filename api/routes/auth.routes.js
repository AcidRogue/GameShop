const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

router.post('/', function (req, res) {
    const db = req.app.locals.db;
    const body = req.body;

    db.collection('users').findOne({Email: body.Email}).then(user => {
        if(user){
            if(bcrypt.compareSync(body.Password, user.Password)){
                res.status(200).json({user: user});
            }
            else{
                res.status(401).json("Wrong email or password")
            }
        }
        else{
            res.status(401).json("Wrong email or password");
        }
    })
});

module.exports = router;
