const express = require("express");
const router = express.Router();
const Place = require("../models/place.js");
const { getReverseGeoCoding } = require("../lib/services");
const Parent = require("../models/parent");

router.get("/places", (req, res, next) => {
  Place.find()
    .then(places => {
      res.json(places);
    })
    .catch(err => next(err));
});
router.get("/parentjson", (req, res, next) => {
  Parent.find()
    .then(parent => {
      res.json(parent);
    })
    .catch(err => next(err));
});

router.post("/places", async (req, res, next) => {
  const { name, address, postcode, city, country } = req.body;
  const obj = {
    name,
    location: {
      type: "Point",
      Address: address,
      Postcode: postcode,
      City: city,
      Country: country
    }
  };
  const response = await getReverseGeoCoding(address, postcode, city, next);
  const data = response.data;
  obj.location.Coordinates = data.features[0].geometry.coordinates;
  Place.create(obj).then(() => {
    res.redirect("/add-places");
  });
});

module.exports = router;
