var express = require('express');
var router = express.Router();
var path = require('path');
var House = require('../models/houses');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var multer = require('multer');


//Get main Admin page
router.get('/', isLoggedIn, function(req, res) {
    console.log("a Logged manager entered /manage");
    mongoose.model('houses').find(null, null, {sort: {'_id': -1}},function(err, hou){
        
        res.render('manage.ejs', {
            user : req.user,
            houses: hou,
            title : 'דף ניהול'
        });
    });
});

router.get('/workers', isLoggedIn, function(req, res) {
    console.log("a Logged manager entered /manage");
    mongoose.model('User').find(null, null, {sort: {'_id': -1}},function(err, users){
        
        res.render('workers.ejs', {
            user : req.user,
            users: users,
            title : 'טבלת עובדים'
        });
    });
});

router.get('/messages', isLoggedIn, function(req, res) {
    console.log("a Logged manager entered /manage");
    mongoose.model('Message').find(null, null, {sort: {'_id': -1}},function(err, users){
        
        res.render('messages.ejs', {
            user : req.user,
            users: users,
            title : 'הודעות'
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
                        newHouse.size = req.body.size;
                        newHouse.comments = req.body.comments;
                        newHouse.subcomments = req.body.subcomments;
                        newHouse.IsRec = req.body.IsRec;

                        newHouse.save(function(err) {
                            if (err) throw err;
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

// SIGNUP =================================
// show the signup form
router.get('/signupform', isLoggedIn, function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage'), 
                               title:"רישום עובדים",
                               user : req.user});
});

// process the signup form
router.post('/signupform', passport.authenticate('local-signup', {
    successRedirect : '/manage/workers', // redirect to the secure manage section
    failureRedirect : '/manage/signupform', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));
   

// IMAGE UPLOADS ============================
router.get('/imgUpload', isLoggedIn, function(req, res) {
    mongoose.model('houses').findById(req.query.id, function(err,house){
        res.render('imgUpload.ejs', { title:"העלאת תמונה",
                                      user : req.user,
                                      house : house });
    })
});

var upload =  multer({
            dest: path.join(__dirname, '/../public/prop-images'),
            limits: {fileSize: 10000000, files:1} });
          
router.post('/upload', upload.single("image"), function(req, res) {
    mongoose.model('houses').findByIdAndUpdate(
        req.query.id,
        {$push: {"images": req.file.filename}},
        {safe: true, upsert: true, new : true},
        function(err, model) {
          if(err)
            console.log(err);
        }
    );
    res.redirect('/manage');
});





//DELETES ====================================     
router.get('/deleteHouse', isLoggedIn, function(req, res){
    mongoose.model('houses').find({ '_id': req.query.id }).remove().exec();

    //houses.find({ id:333 }).remove().exec();
    res.redirect('/manage');
});
router.get('/deleteUser', isLoggedIn, function(req, res){
    mongoose.model('User').find({ '_id': req.query.id }).remove().exec();

    //houses.find({ id:333 }).remove().exec();
    res.redirect('/manage');
});
router.get('/deleteMessage', isLoggedIn, function(req, res){
    mongoose.model('Message').find({ '_id': req.query.id }).remove().exec();

    //houses.find({ id:333 }).remove().exec();
    res.redirect('/manage');
});



        
// route middleware to check user is not logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    console.log("un-Logged user tried to enter /manage");
    res.redirect('/');
}

module.exports = router;
