const express = require('express');
const app = express();
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');

const rootPath = path.normalize(path.join(__dirname, '..'));

const userRoutes = require('./routes/user.routes.js');
const authRoutes = require('./routes/auth.routes');
const serverRoutes = require('./routes/server.routes');
const subscriptionRoutes = require('./routes/subscription.routes');
const unsubscriptionRoutes = require('./routes/unsubscription.routes');
const messageRoutes = require('./routes/message.routes');
const searchRoutes = require('./routes/search.routes');

app.set('app', path.join(rootPath, 'app'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use('/api/users', userRoutes);
app.use('/api/authenticate', authRoutes);
app.use('/api/servers', serverRoutes);
app.use('/api/subscribe', subscriptionRoutes);
app.use('/api/unsubscribe', unsubscriptionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/search', searchRoutes);

app.use(function (req, res, next) {
    let err = new Error('Not Found');
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
