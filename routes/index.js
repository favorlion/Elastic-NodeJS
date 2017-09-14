var express = require('express');
var router = express.Router();


router.use('/pages', require('./pages'));
/* GET home page. */
router.get('/', function(req, res, next) {

    console.log('App is launching...');

    res.render('index', { title: 'Success' });

});

router.get('/logout', (req, res) => {

    res.clearCookie('email');
    res.clearCookie('password');
    res.clearCookie('id');
    res.clearCookie('username');

    res.redirect('/');
});
/* Login Page */


module.exports = router;