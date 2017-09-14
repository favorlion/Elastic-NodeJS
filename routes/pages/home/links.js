var express = require('express');
var router = express.Router();
var async = require('async');
// var mongodb = require('mongodb');
// var path = require('path');


Link = require('../../../models/link');

router.get('/', (req, res, next) => {


    if (req.cookies.email && req.cookies.password) {
        res.render('pages/home/links', { title: 'links' });
    } else {
        res.redirect('/pages/login');
    }

});


router.post('/', (req, res, next) => {

    var userid = req.cookies.userid;

    Link.find({ "user.userid": userid }, function(err, links) {

        if (err) return res.status(500).send({ error: 'database failure' });


        res.json(links);
    });

});

router.post('/get', (req, res, next) => {
    var linkid = req.body.linkid;

    Link.findOne({ _id: linkid }, function(err, link) {
        if (err) return res.status(500).send({ error: 'database failure' });

        res.json(link);
    });
});

router.post('/delete', (req, res, next) => {

    var linkids = req.body.linkids;
    console.log(linkids);

    async.parallel([

        function(callback) {
            Link.remove({ _id: { $in: linkids } }, function(err) {
                if (err) return res.status(500).send({ error: 'database failure' });
                res.status(204).end();
            });

            callback(null, "success");
        }
    ]);

    // Link.remove({ _id: linkid }, function(err, output) {

    //     if (err) return res.status(500).send({ error: 'database failure' });

    //     res.status(204).end();
    // })

});

router.post('/edit', (req, res, next) => {

    var linkid = req.body.linkid;



});

module.exports = router;