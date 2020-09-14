var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var btoa = require("btoa");
var _ = require("lodash");

router.get("/", async (req, res, next) => {
    try {
        const house = await mongoose
            .model("houses")
            .findOne({ _id: req.query.id });

        const images =_.some(house.images)
            ? house.images.map(
                  (img) =>
                      `data:image/png;base64,${btoa(
                          String.fromCharCode.apply(null, img.data)
                      )}`
              )
            : ["prop-images/0/1.jpg"];

        res.render("property.ejs", {
            housenum: req.query.id,
            house,
            images,
            title: "דף בית",

        });
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
});

module.exports = router;
