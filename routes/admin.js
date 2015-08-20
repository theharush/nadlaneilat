var express = require('express');
var router = express.Router();
var path = require('path');
var House = require('../models/houses');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

//Get main Admin page
router.get('/', isLoggedIn, function(req, res) {
    console.log("a Logged manager entered /manage");
    mongoose.model('houses').find(function(err, hou){
        //var housesjson = JSON.stringify(hou, null, 4);
        
        res.render('manage.ejs', {
            user : req.user,
            houses: hou,
            title : 'דף ניהול'
        });
    });
});

//Get house adding form
router.get('/addhouseform', isLoggedIn, function(req, res) {
    res.render('addhouseform.ejs', {
        user : req.user,
        title : 'הוסף בית'
    });
});

router.post('/addhouseform', function(req, res) {
        // asynchronous
        process.nextTick(function() {
            // if the user is not already logged in:
            if (req.user) {
                House.findOne({ 'adress' :  req.body.adress }, function(err, house) {
                    // if there are any errors, return the error

                    if (err){
                        console.log("1")
                        return;
                    }

                    // check to see if theres already a user with that username
                    if (house) {
                        console.log("2")
                        return;
                    } else {
                        // create the user
                        var newHouse = new House();

                        newHouse.adress    = req.body.adress;
                        newHouse.price = req.body.price;
                        newHouse.roomnum = req.body.roomnum;
                        newHouse.action = req.body.action;
                        newHouse.view = req.body.view;
                        newHouse.comments = req.body.comments;
                        newHouse.subcomments = req.body.subcomments;
                        newHouse.IsRec = req.body.IsRec;

                        newHouse.save(function(err) {
                            if (err) throw err;
                            console.log('house saved successfully!');
                            res.redirect('/manage');
                        });
                    }

                });
            // if the user is logged in but has no local account...
            } else {
                // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                res.redirect('/');
            }
    });
});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================
        // SIGNUP =================================
        // show the signup form
        router.get('/signupform', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage'), 
                                       title:"רישום עובדים",
                                       user : req.user});
        });

        // process the signup form
        router.post('/signupform', passport.authenticate('local-signup', {
            successRedirect : '/manage', // redirect to the secure manage section
            failureRedirect : '/manage/signupform', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));
        
        
// route middleware to check user is not logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    console.log("un-Logged user tried to enter /manage");
    res.redirect('/');
}

module.exports = router;
