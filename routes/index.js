const express = require("express");
const _ = require("lodash");
const mongoose = require("mongoose");
const helper = require(global.path + "/utils/helper.js");

const router = express.Router();

/* GET home page. */
router.get("/", async (req, res, next) => {
    const houses = await mongoose.model("houses").find().sort({ _id: -1 });

    houses.forEach(
        (house) => (house._doc.images = helper.imagesDataToSrc(house.images))
    );

    res.render("index", { title: "נדלן אילת", houses });
});

module.exports = router;
