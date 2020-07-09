const express = require('express');
const router = express.Router();

router.post('/', function (req, res) {
    const db = req.app.locals.db;
    const body = req.body;

    db.collection('users').findOne({Email: body.Email, Password: body.Password}).then(user => {
        if(user){
            res.status(200).json({user: user});
        }
        res.status(401).json("Wrong username or password")
    })
});



module.exports = router;
