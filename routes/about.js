var express = require('express');
var router = express.Router();

/* GET about page. */
router.get('/', function(req, res, next) {
  res.render('about', { title: 'אודות המשרד',
                        name : 'Eyal'});
});

module.exports = router;
