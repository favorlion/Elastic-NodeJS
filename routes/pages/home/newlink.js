var express = require('express');
var router = express.Router();
var async = require('async');
// var path = require('path');

Link = require('../../../models/link');

router.get('/', (req, res, next) => {

    if (req.cookies.email && req.cookies.password) {
        res.render('pages/home/newlink', { title: 'newlink' });
    } else {
        res.redirect('/pages/login');
    }

});

router.post('/', (req, res, next) => {

    var title = req.body.title;

    if (!title) {

        return res.status(500).send({ error: 'input error' });
    }

    console.log("user id is -----------------------" + req.cookies.userid);
    var link = new Link({

        "title": title,
        "user": {
            "userid": req.cookies.userid,
            "username": req.cookies.username,
            "email": req.cookies.email
        }
    });

    console.log("Request received : " + title);

    async.waterfall([

        function(next) {

            link.save(function(err) {

                if (err) {

                    console.log("Error is occurred when save a new link");

                    return res.status(500).send({ error: 'database failure' });
                } else {

                    res.json({ link: link });

                }
            });

            next();
        }
    ]);


});

router.post('/update', (req, res, next) => {

    var id = req.body.id;
    console.log("Data received : " + id);

    Link.findById(id, function(err, link) {

        if (err) return res.status(500).json({ error: 'database failure' });

        if (!link) return res.status(404).json({ error: 'link not found' });

        console.log(req.body);
        if (req.body.keywords) link.keywords = req.body.keywords;
        if (req.body.categories) link.categories = req.body.categories;
        if (req.body.sources) link.sources = req.body.sources;
        if (req.body.start_date) link.start_date = req.body.start_date;
        if (req.body.end_date) link.end_date = req.body.end_date;
        link.alert = req.body.alert;

        console.log(link);

        link.save(function(err) {

            if (err) res.status(500).json({ error: 'failed to update' });

            res.json({ message: 'link updated' });
        });
    });
});

module.exports = router;