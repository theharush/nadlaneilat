var express = require("express");
var router = express.Router();
var path = require("path");
var House = require("../models/houses");
var logs = require("../models/logs");
var mongoose = require("mongoose");
var passport = require("passport");
var multer = require("multer");
const fs = require("fs-extra");
const tempDir = path.join(global.path + "/uploads/");

//=======================================================
// GET REQUEST ==========================================
//=======================================================

//Admin homepage
router.get("/", isLoggedIn, function (req, res) {
    console.log("a Logged manager entered /manage");
    mongoose
        .model("houses")
        .find(null, null, { sort: { _id: -1 } }, function (err, hou) {
            res.render("manage.ejs", {
                user: req.user,
                houses: hou,
                title: "דף ניהול",
            });
        });
});

//Workers Table
router.get("/workers", isLoggedIn, function (req, res) {
    console.log("a Logged manager entered /manage");
    mongoose
        .model("User")
        .find(null, null, { sort: { _id: -1 } }, function (err, users) {
            res.render("workers.ejs", {
                user: req.user,
                users: users,
                title: "טבלת עובדים",
            });
        });
});

//Messeges Table
router.get("/messages", isLoggedIn, function (req, res) {
    console.log("a Logged manager entered /manage");
    mongoose
        .model("Message")
        .find(null, null, { sort: { _id: -1 } }, function (err, messages) {
            res.render("messages.ejs", {
                user: req.user,
                messages: messages,
                title: "הודעות",
            });
        });
});

//Logs Table
router.get("/logs", isLoggedIn, function (req, res) {
    console.log("a Logged manager entered /manage");
    mongoose
        .model("logs")
        .find(null, null, { sort: { _id: -1 } })
        .populate("user")
        .exec(function (err, logs) {
            console.log(logs);
            res.render("logs.ejs", {
                user: req.user,
                logs: logs,
                title: "פעולות",
            });
        });
});

//House adding form
router.get("/addhouseform", isLoggedIn, function (req, res) {
    res.render("addhouseform.ejs", {
        user: req.user,
        title: "הוסף בית",
    });
});

//house editing form
router.get("/edithouseform", isLoggedIn, function (req, res) {
    mongoose
        .model("houses")
        .findOne({ _id: req.query.id }, function (err, hou) {
            res.render("edithouseform.ejs", {
                user: req.user,
                housenum: req.query.id,
                house: hou,
                title: "ערוך בית",
            });
        });
});

//SignUp form
router.get("/signupform", isLoggedIn, function (req, res) {
    res.render("signup.ejs", {
        message: req.flash("signupMessage"),
        title: "רישום עובדים",
        user: req.user,
    });
});

//Upload Image
router.get("/imgUpload", isLoggedIn, function (req, res) {
    mongoose.model("houses").findById(req.query.id, function (err, house) {
        res.render("imgUpload.ejs", {
            title: "העלאת תמונה",
            user: req.user,
            house: house,
        });
    });
});

//=======================================================
// POST REQUEST ==========================================
//=======================================================

//add house
router.post("/addhouseform", function (req, res) {
    // asynchronous
    process.nextTick(function () {
        // if the user is not already logged in:
        if (req.user) {
            House.findOne({ adress: req.body.adress }, function (err, house) {
                // if there are any errors, return the error

                if (err) {
                    console.log("1");
                    return;
                }

                // check to see if theres already a user with that username
                // create the user
                var newHouse = new House();

                newHouse.adress = req.body.adress;
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

                newHouse.save(function (err) {
                    if (err) throw err;

                    var newLog = new logs();
                    newLog.user = req.user._id;
                    newLog.action = "הוספה";
                    newLog.target = newHouse.adress;
                    newLog.save(function (err) {
                        if (err) throw err;
                    });

                    res.redirect("/manage");
                });
            });
            // if the user is logged in but has no local account...
        } else {
            // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
            res.redirect("/");
        }
    });
});

//edit house
router.post("/edithouseform", function (req, res) {
    // asynchronous
    process.nextTick(function () {
        // if the user is not already logged in:
        if (req.user) {
            House.findOne({ _id: req.body._id }, function (err, house) {
                // if there are any errors, return the error

                if (err) {
                    console.log("1");
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

                    house.save(function (err) {
                        if (err) throw err;

                        var newLog = new logs();
                        newLog.user = req.user._id;
                        newLog.action = "עריכה";
                        newLog.target = house.adress;
                        newLog.save(function (err) {
                            if (err) throw err;
                        });

                        res.redirect("/manage");
                    });
                } else {
                    // create the user
                    var newHouse = new House();

                    newHouse.adress = req.body.adress;
                    newHouse.price = req.body.price;
                    newHouse.roomnum = req.body.roomnum;
                    newHouse.action = req.body.action;
                    newHouse.view = req.body.view;
                    newHouse.size = req.body.size;
                    newHouse.floor = req.body.floor;
                    newHouse.comments = req.body.comments;
                    newHouse.subcomments = req.body.subcomments;
                    newHouse.IsRec = req.body.IsRec;

                    newHouse.save(function (err) {
                        if (err) throw err;
                        res.redirect("/manage");
                    });
                }
            });
            // if the user is logged in but has no local account...
        } else {
            // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
            res.redirect("/");
        }
    });
});

//signup form
router.post(
    "/signupform",
    passport.authenticate("local-signup", {
        successRedirect: "/manage/workers", // redirect to the secure manage section
        failureRedirect: "/manage/signupform", // redirect back to the signup page if there is an error
        failureFlash: true, // allow flash messages
    })
);

//get File Extension from multer file obj
const getExtension = (file) => {
    let extArray = file.mimetype.split("/");
    return extArray[extArray.length - 1];
};

//setting multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname} - ${Date.now()}.${getExtension(file)}`);
    },
});

const upload = multer({ storage: storage });

const cleanUpTemp = async () => {
    try {
        await fs.emptyDir(tempDir);
        console.log("success!");
    } catch (err) {
        console.error(err);
    }
};

router.post("/upload", upload.single("image"), async (req, res) => {
    try {
        const image = req.file;

        if (!image) {
            const error = new Error("Please upload a file");
            error.httpStatusCode = 400;
            return next(error);
        }

        const house = await mongoose
            .model("houses")
            .findOne({ _id: req.query.id });

        house.images.push({
            data: fs.readFileSync(tempDir + req.file.filename),
            contentType: "image/jpg",
        });

        await house.save();
    } catch (error) {
        console.log("error uploading an img", error);
    }
    cleanUpTemp();
    res.redirect("/manage");
});

//=======================================================
// DELETES ==============================================
//=======================================================
router.get("/deleteHouse", isLoggedIn, function (req, res) {
    mongoose
        .model("houses")
        .findOne({ _id: req.query.id })
        .exec(function (err, house) {
            var newLog = new logs();

            newLog.user = req.user._id;
            newLog.action = "מחיקה";
            newLog.target = house.adress;

            newLog.save(function (err) {
                if (err) throw err;
                mongoose
                    .model("houses")
                    .find({ _id: req.query.id })
                    .remove()
                    .exec();
            });
        });

    res.redirect("/manage");
});

router.get("/deleteUser", isLoggedIn, function (req, res) {
    mongoose
        .model("User")
        .findOne({ _id: req.query.id })
        .exec(function (err, user) {
            var newLog = new logs();

            newLog.user = req.user._id;
            newLog.action = "מחיקה";
            newLog.target = user.name;

            newLog.save(function (err) {
                if (err) throw err;
                mongoose
                    .model("User")
                    .find({ _id: req.query.id })
                    .remove()
                    .exec();
            });
        });

    res.redirect("/manage");
});

router.get("/deleteMessage", isLoggedIn, function (req, res) {
    mongoose.model("Message").find({ _id: req.query.id }).remove().exec();
    res.redirect("/manage");
});

//=======================================================
// functions ==========================================
//=======================================================
// route middleware to check user is not logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();

    console.log("un-Logged user tried to enter /manage");
    res.redirect("/");
}

module.exports = router;
