var express = require('express');
var router = express.Router();
var passport = require('passport');

// LOGIN ===============================
// show the login form
router.get('/', isLoggedIn, function(req, res) {
    res.render('login.ejs', { title: 'כניסת מנהלים',
                              message: req.flash('loginMessage')});

});

// process the login form
router.post('/', passport.authenticate('local-login', {
    successRedirect : '/manage', // redirect to the secure manage section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

// route middleware to check user is logged in
function isLoggedIn(req, res, next) {
    if (!req.isAuthenticated())
        return next();

    res.redirect('/manage');
}

module.exports = router;
