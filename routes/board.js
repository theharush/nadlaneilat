var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

/* GET board page. */
router.get('/', function(req, res, next) {
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
        res.render('board', { title: 'לוח נכסים',
                              query: query,
                              properties: hou});
    });
});

module.exports = router;
