var express = require('express');
var router = express.Router();
var async = require('async');
// var path = require('path');

User = require('../../../models/user');

router.get('/', (req, res, next) => {

    if (req.cookies.email && req.cookies.password) {
        console.log("redirected to home page");
        res.render('pages/home/home', { title: 'home' });

    } else {

        res.render('pages/login/login', { title: 'Express' });

    }

});

router.post('/', (req, res, next) => {

    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ email: email }, function(err, user) {

        if (err != null) {

            console.log("error is occurred");
            res.render('pages/login/login', { message: 'Error while logging in:' + err });
            return;
        }

        if (user == null) {

            console.log("Email is incorrect");
            res.render('pages/login/login', { message: 'Email is incorrect' });
            return;
        }

        user.comparePassword(password, function(err, isMatch) {

            if (err != null) {

                console.log("Error is occurred");
                res.render('pages/login/login', { message: 'Error when comparing password: ' + err });
                return;
            }

            if (isMatch) {

                res.cookie('email', email);
                res.cookie('password', password);
                res.cookie('userid', user.id);
                res.cookie('username', user.username);

                console.log('password is correct-----------------------------------------------' + user.id);

                res.redirect('/pages/home');
                return;
            } else {

                console.log('password is incorrect');
                res.render('pages/login/login', { message: 'Login Error. Password is incorrect' });
                return;
            }

        });


    });


});

module.exports = router;