const express = require("express");
const router = express.Router();
const Parent = require("../models/parent");

router.get("/places", (req, res, next) => {
  Parent.find().then(data => {
    res.json(data);
  });
});

module.exports = router;
