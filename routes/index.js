const express = require("express");
const router = express.Router();
const Place = require("../models/Place.js");

/* GET home page */
router.get("/", (req, res, next) => {
    const isLoggedIn = req.user ? true : false;
    res.render("index", { isLoggedIn });
});

router.get("/add-places", (req, res, next) => {
    res.render("add-places");
});

router.post("/add-places", (req, res, next) => {
    const newPlace = new Place({
        name: req.body.name,
        place: req.body.place,
        location: {
            coordinates: [req.body.longitude, req.body.latitude]
        }
    });

    newPlace
        .save()
        .then(() => {
            res.redirect("/");
        })
        .catch(err => {
            console.log(err);
        });
});

module.exports = router;
