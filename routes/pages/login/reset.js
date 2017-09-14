var express = require('express');
var router = express.Router();
var async = require('async');
var nodemailer = require('nodemailer');

User = require('../../../models/user');

router.get('/:token', (req, res, next) => {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
        if (!user) {
            res.render('pages/login/forgot_password', { message: 'Password reset token is invalid or has expired.' });
            return;
        }

        res.redirect('/pages/reset');
    });
});

router.post('/:token', (req, res, next) => {
    async.waterfall([
        (done) => {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
                if (!user) {
                    return res.render('pages/login/forgot_password', { message: 'Password reset token is invalid or has expired.' });
                }

                user.password = req.body.password;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save((err) => {
                    if (err) {
                        return res.render('pages/login/forgot_password', { message: 'Error while reset password' + err });
                    }

                    res.render('pages/login/res');
                    done(err, user);
                });
            });
        },

        (user, done) => {
            var transporter = nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: '<USER>',
                    pass: '<PASS>',
                }
            });

            var mailOptions = {
                to: user.email,
                from: 'admin@newsace.com',
                subject: 'Your password has been changed',
                text: 'Dear, ' + user.username + '\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n\n' +
                    'Regards, \n\n' +
                    'NewsAceTeam.'
            };

            transporter.sendMail(mailOptions, (err) => {
                console.log('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
            });
        }
    ], (err) => {
        res.redirect('/');
    });
    // res.render('dashboard/index', req.app.locals.appdata);
});

module.exports = router;