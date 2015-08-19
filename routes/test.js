var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('test', { title: 'test' });
});

router.post('/', function(req, res){
  res.send(req.body.email);
  console.log('hi');
})


module.exports = router;
