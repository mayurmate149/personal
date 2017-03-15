var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var io = require('socket.io');
/*var routes = require('./routes/index');*/
var users = require('./routes/user.routes');
var projects = require('./routes/project.routes');
var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

/*app.use('/', routes);*/
app.use('/users', users);
app.use('/projects', projects);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

var allowCrossDomain = function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
}


app.use(allowCrossDomain);
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

const port = 3004;

var server = app.listen(port, function(){

    console.log('Server started on ' + port);
});


io = io.listen(server);
io.on('connection', function (socket) {
    console.log("Socket Ready");

    // broadcast a user's message to other users
    socket.on('send:message', function (data) {
        console.log('in send message');
        socket.broadcast.emit('send:message', {
            data: data
        });
    });
});


module.exports = app;