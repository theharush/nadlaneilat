var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

router.get('/', function(req, res) {
    var adress=req.query.adress;
    var price=parseInt(req.query.price) + 1;
    var roomnum=req.query.roomnum;
    var query = {};
    
    if(adress)
        query.adress=new RegExp(adress, "i");
    if(price)
        query.price = { $gt: 0, $lt: price };
    if(roomnum)
        query.roomnum = roomnum;
        
    console.log(query);
    mongoose.model('houses').find(query, function(err, hou){
        res.render('board', { title: 'Board',
                              properties: hou});
    });
});

module.exports = router;

