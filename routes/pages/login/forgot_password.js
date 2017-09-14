var express = require('express');
var router = express.Router();
var async = require('async');
var crypto = require('crypto');
var nodeMailer = require('nodemailer');

User = require('../../../models/user');
// var path = require('path');

router.get('/', (req, res, next) => {


    if (req.cookies.email && req.cookies.password) {
        console.log("redirected to home page");

        res.render('pages/home/home', { title: 'home' });
    } else {
        console.log("redirected to forgot_password");
        res.render('pages/login/forgot_password', { sent: 0 });
    }
});

router.post('/', (req, res, next) => {

    var email = req.body.email;

    console.log("email is ---------------" + email);

    async.waterfall([
        (done) => {

            crypto.randomBytes(20, (err, buf) => {

                var token = buf.toString('hex');
                console.log("token is ------------" + token);
                done(err, token);
            });
        },

        (token, done) => {

            User.findOne({ email: email }, (err, user) => {

                if (err) {

                    return done(err);
                }

                if (!user) {
                    console.log('user is not exist===================************');
                    res.render('pages/login/forgot_password', { message: 'No account with that email address exists.' });

                    return;
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000;

                user.save((err) => {
                    done(err, token, user);
                });
            });
        },

        (token, user, done) => {

            var transporter = nodeMailer.createTransport({

                service: 'SendGrid',
                auth: {
                    user: '<USER>',
                    pass: '<PASS>',
                }
            });

            var mailOptions = {
                to: user.email,
                from: 'admin@newsace.com',
                subject: 'NEWSACE - Reset your password',
                text: 'Hello, \n\n' +
                    'We received a request to reset your password \n\n' +
                    'http://' + req.headers.host + '/pages/reset/' + token + '\n\n' +
                    'Regards, \n\n' +
                    'NEWSACE Team.'
            };

            transporter.sendMail(mailOptions, (err) => {
                req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err);
            });
        }
    ], (err) => {
        if (err) return next(err);
        res.render('pages/login/forgot_password', { sent: 1 });
    });
});

module.exports = router;