var express = require('express');
var router = express.Router();
var path = require('path');



router.get('/', isLoggedIn, function(req, res) {
    console.log("a Logged manager entered /manage");//res.redirect('/');
    
    res.render('manage.ejs', {
        user : req.user,
        title : 'דף ניהול'
    });
});
router.get('/addhouseform', isLoggedIn, function(req, res) {
    res.render('addhouseform.ejs', {
        user : req.user,
        title : 'הוסף בית'
    });
});

// route middleware to check user is not logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    console.log("un-Logged user tried to enter /manage");
    res.redirect('/');
}

module.exports = router;
