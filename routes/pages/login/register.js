var express = require('express');
var router = express.Router();
var async = require('async');
// var path = require('path');

User = require('../../../models/user');

router.get('/', (req, res, next) => {
    res.render('pages/login/register', req.app.locals.appdata);
});

router.post('/', (req, res, next) => {

    var email = req.body.email;
    var password = req.body.password;
    var username = req.body.username;

    console.log("username is " + username);

    var user = new User({
        "username": username,
        "password": password,
        "email": email
    });

    console.log('user is created.');

    async.waterfall([

        function(next) {

            user.save(function(err){

                if (err) {

                    res.render('pages/login/login', {title:"Error"});
                } else {

                    res.redirect('/pages/home');
                    // res.render('pages/home/home', {title:"success"});
                }
            });

            next();
        }
    ]);
})

module.exports = router;