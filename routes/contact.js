var express = require('express');
var router = express.Router();

/* GET board page. */
router.get('/', function(req, res, next) {
  res.render('contact', { title: 'contact'});
});

module.exports = router;
