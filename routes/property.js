var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const helper = require(global.path  +  "/utils/helper.js")

router.get("/", async (req, res, next) => {
    try {
        const house = await mongoose
            .model("houses")
            .findOne({ _id: req.query.id });

        house._doc.images = helper.imagesDataToSrc(house.images)


        res.render("property.ejs", {
            housenum: req.query.id,
            house,
            title: "דף בית",

        });
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
});

module.exports = router;
