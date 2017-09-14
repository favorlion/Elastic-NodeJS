var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var session = require('express-session');
var flash = require('express-flash');
var index = require('./routes');
var users = require('./routes/users');



var app = express();

function Elastic(config) {

    this.init = () => {

        console.log("App is running...");
        // view engine setup
        app.locals.appdata = config.appData;
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'ejs');

        // uncomment after placing your favicon in /public
        // app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
        app.use(logger('dev'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(session({
            resave: false, // don't save session if unmodified
            saveUninitialized: false, // don't create session until something stored
            secret: 'session'
        }));
        app.use(flash());
        app.use(express.static(path.join(__dirname, 'public')));
        app.use('/', index);
        app.use('/users', users);

    };

    this.connectMongoDB = () => {
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, '[ERROR] Database loading error\n[ERROR]'));
        db.once('open', function() {
            console.log("[INFO] connection to the database established");
        });

        mongoose.connect(config.db.type + '://' + config.db.servers[0] + '/' + config.db.name, function(err, db) {
            if (!err) {
                console.log("We are connected");
            } else {
                console.log(err);
            }
        });
    }

    this.initializePassport = () => {
        app.use(passport.initialize());
        app.use(passport.session());

        passport.serializeUser(function(user, done) {
            done(null, user.id);
        });

        passport.deserializeUser(function(id, done) {
            User.findById(id, function(err, user) {
                done(err, user);
            });
        });
    };


    this.initErrorHandler = () => {
        // catch 404 and forward to error handler

        app.use(function(req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        // error handler
        app.use(function(err, req, res, next) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });
    };

    this.start = () => {

        var self = this;
        self.init();
        self.connectMongoDB();
        self.initializePassport();
        self.initErrorHandler();
    };

};

Elastic.startInstance = () => {

    var Configuration = require('./config.js');

    var config = Configuration.load();
    var elastic = new Elastic(config);
    elastic.start();

    return elastic;
}

Elastic.startInstance();
module.exports = app;