var express = require('express');
var router = express.Router();
var path = require('path');
var House = require('../models/houses');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var multer = require('multer');
var s3 = require('multer-s3');
var s3fs = require('s3fs');
var fsImpl = new s3fs('nadlaneilatimages', { 
                      accessKeyId: 'AKIAIBP24N763Y6Y42DA',
                      secretAccessKey: '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' });
     
     
                      
//=======================================================
// GET REQUEST ==========================================
//=======================================================
                    
//Admin homepage
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


//Workers Table
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


//Messeges Table
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


//House adding form
router.get('/addhouseform', isLoggedIn, function(req, res) {
    res.render('addhouseform.ejs', {
        user : req.user,
        title : 'הוסף בית'
    });
});


//house editing form
router.get('/edithouseform', isLoggedIn, function(req, res) {
      mongoose.model('houses').findOne({ '_id': req.query.id }, function(err, hou){
        res.render('edithouseform.ejs', {
            user : req.user,
            housenum: req.query.id,
            house: hou,
            title : 'ערוך בית'
        });
    });
});


//SignUp form
router.get('/signupform', isLoggedIn, function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage'), 
                               title:"רישום עובדים",
                               user : req.user});
});


//Upload Image
router.get('/imgUpload', isLoggedIn, function(req, res) {
    mongoose.model('houses').findById(req.query.id, function(err,house){
        res.render('imgUpload.ejs', { title:"העלאת תמונה",
                                      user : req.user,
                                      house : house });
    })
});



//=======================================================
// POST REQUEST ==========================================
//=======================================================

//add house
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

                        // create the user
                        var newHouse = new House();

                        newHouse.adress    = req.body.adress;
                        newHouse.price = req.body.price;
                        newHouse.roomnum = req.body.roomnum;
                        newHouse.action = req.body.action;
                        newHouse.view = req.body.view;
                        newHouse.size = req.body.size;
                        newHouse.floor = req.body.floor;
                        newHouse.housetype = req.body.housetype;
                        newHouse.comments = req.body.comments;
                        newHouse.subcomments = req.body.subcomments;
                        newHouse.IsRec = req.body.IsRec;
                        
                        newHouse.save(function(err) {
                            if (err) throw err;
                            res.redirect('/manage');
                        });
                    

                });
            // if the user is logged in but has no local account...
            } else {
                // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                res.redirect('/');
            }
    });
});


//edit house
router.post('/edithouseform', function(req, res) {
        // asynchronous
        process.nextTick(function() {
            // if the user is not already logged in:
            if (req.user) {
                House.findOne({ '_id' :  req.body._id }, function(err, house) {
                    // if there are any errors, return the error

                    if (err){
                        console.log("1")
                        return;
                    }

                    // check to see if theres already a user with that username
                    if (house) {
                        house.adress = req.body.adress;
                        house.price = req.body.price;
                        house.roomnum = req.body.roomnum;
                        house.action = req.body.action;
                        house.view = req.body.view;
                        house.size = req.body.size;
                        house.floor = req.body.floor;
                        house.housetype = req.body.housetype;
                        house.comments = req.body.comments;
                        house.subcomments = req.body.subcomments;
                        house.IsRec = req.body.IsRec;
                        
                        house.save(function(err) {
                            if (err) throw err;
                            res.redirect('/manage');
                        });
                        
                    } else {
                        // create the user
                        var newHouse = new House();

                        newHouse.adress    = req.body.adress;
                        newHouse.price = req.body.price;
                        newHouse.roomnum = req.body.roomnum;
                        newHouse.action = req.body.action;
                        newHouse.view = req.body.view;
                        newHouse.size = req.body.size;
                        newHouse.floor = req.body.floor;
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



//signup form
router.post('/signupform', passport.authenticate('local-signup', {
    successRedirect : '/manage/workers', // redirect to the secure manage section
    failureRedirect : '/manage/signupform', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));
   
   
   
   
//upload IMG
var uploadS3 = multer({
  storage: s3({
    dirname: '/prop-images',
    bucket: 'nadlaneilatimages',
    secretAccessKey: 'HfDeiycIQrtxi2WnrUxI1NOAuIteJ5zpxHjrqOTw',
    accessKeyId: 'AKIAIBP24N763Y6Y42DA',
    region: 'us-east-1'
  }),
  limits: {fileSize: 10000000, files:1}
});

router.post('/upload', uploadS3.single("image"), function(req, res) {
    mongoose.model('houses').findByIdAndUpdate(
        req.query.id,
        {$push: {"images": req.file.key}},
        {safe: true, upsert: true, new : true},
        function(err, model) {
          if(err)
            console.log(err);
        }
    );
    res.redirect('/manage');
});




//=======================================================
// DELETES ==============================================
//=======================================================
router.get('/deleteHouse', isLoggedIn, function(req, res){
    mongoose.model('houses').find({ '_id': req.query.id }).remove().exec();
    res.redirect('/manage');
});

router.get('/deleteUser', isLoggedIn, function(req, res){
    mongoose.model('User').find({ '_id': req.query.id }).remove().exec();
    res.redirect('/manage');
});

router.get('/deleteMessage', isLoggedIn, function(req, res){
    mongoose.model('Message').find({ '_id': req.query.id }).remove().exec();
    res.redirect('/manage');
});



//=======================================================
// functions ==========================================
//=======================================================  
// route middleware to check user is not logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    console.log("un-Logged user tried to enter /manage");
    res.redirect('/');
}

module.exports = router;
