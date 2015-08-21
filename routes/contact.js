var express = require('express');
var router = express.Router();
var Message = require('../models/message');


/* GET contact page. */
router.get('/', function(req, res, next) {
  res.render('contact', { title: 'Contact'});
});


router.post('/', function(req, res) {
        // asynchronous
        process.nextTick(function() {
            
                        // create the user
                        var newMessage = new Message();

                        newMessage.name    = req.body.fullname;
                        newMessage.email = req.body.email;
                        newMessage.phone = req.body.phone;
                        newMessage.subject = req.body.subject;
                        newMessage.message = req.body.message;

                        newMessage.save(function(err) {
                            if (err) throw err;
                            res.redirect('/');
                        });

    });
});

module.exports = router;

