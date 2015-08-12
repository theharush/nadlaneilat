var express = require('express');
var router = express.Router();
// var sendgrid  = require('sendgrid')('nadlaneilat','h1a2r3u4s5h');


// sendgrid.send({
//   to:       'theharush@gmail.com',
//   from:     'noreply@example.com',
//   subject:  'Hello World',
//   text:     'My first email through SendGrid.'
// }, function(err, json) {
//   if (err) { console.log('error'); }
//   console.log('yayyyyy');
// });


/* GET contact page. */
router.get('/', function(req, res, next) {
  res.render('contact', { title: 'Contact'});
});


module.exports = router;

