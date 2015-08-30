var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

router.get('/', function(req, res, next) {
  mongoose.model('houses').findOne({ '_id': req.query.id }, function(err, hou){
        res.render('property.ejs', {
            housenum: req.query.id,
            house: hou,
            title : 'דף בית'
        });
    });
});


module.exports = router;
