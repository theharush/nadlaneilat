var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

/* GET board page. */
router.get('/', function(req, res, next) {
        res.render('projects', { title: 'פרוייקטים'});
});

module.exports = router;
