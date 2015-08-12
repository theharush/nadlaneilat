var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  console.log('Request URL:', req.originalUrl);
  console.log('Request query:', req.query.id);
  res.render('property', { housenum: req.query.id });
});


module.exports = router;
