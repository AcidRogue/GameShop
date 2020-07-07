const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');

const rootPath = path.normalize(path.join(__dirname, '..'));
const userRoutes = require('./routes/user.routes.js');

const app = express();

app.set('app', path.join(rootPath, 'app'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use('/api/users', userRoutes);


app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
} else {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: {}
        });
    });
}

const url = 'mongodb://localhost:27017/webchatroom';

MongoClient.connect(url, function(err, client) {
    if(err){
        console.log(err);
        return;
    }
    console.log("Connected successfully to server");

    app.locals.db = client.db('webchatroom');


    app.listen(9000, err => {
        if (err) {
            throw err;
        }
        console.log(`Example app listening on port 9000!`);
    });
});