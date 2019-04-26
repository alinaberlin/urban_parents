//parent route view
const express = require("express");
const router = express.Router();
const Parent = require("../models/parent");
const Child = require("../models/child");
const Activity = require("../models/activity");
const ensureLogin = require("connect-ensure-login");
const { getReverseGeoCoding } = require("../lib/services");

// parent route
router.get("/registration", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const currentParent = req.user;
  const isLoggedIn = req.user ? true : false;
  res.render("parent", {
    parent: currentParent,
    isLoggedIn: isLoggedIn
  });
});

router.get("/parent", ensureLogin.ensureLoggedIn(), async (req, res, next) => {
  const currentParent = req.user;
  const isLoggedIn = req.user ? true : false;
  res.render("parent_details", {
    parent: currentParent,
    isLoggedIn: isLoggedIn
  });
});
router.post("/parent", ensureLogin.ensureLoggedIn(), async (req, res, next) => {
  const currentParent = req.user;

  const {
    username,
    firstName,
    lastName,
    age,
    email,
    language,
    nationality,
    gender,
    address,
    postcode,
    city,
    country,
    ocupation,
    pictureUrl
  } = req.body;
  const location = {
    type: "Point",
    Address: address,
    Postcode: postcode,
    City: city,
    Country: country
  };
  const response = await getReverseGeoCoding(address, postcode, city, next);
  const data = response.data;
  location.Coordinates = data.features[0].geometry.coordinates;
  console.log(location.coordinates);

  Parent.findOneAndUpdate(
    { _id: currentParent._id },
    {
      username,
      firstName,
      lastName,
      age,
      email,
      language,
      nationality,
      gender,
      address,
      postcode,
      city,
      country,
      ocupation,
      pictureUrl,
      location
    }
  ).then(parent => {
    Parent.find({ language: language })
      .then(matches => {
        matches.pop();
        res.render("parent_details", { parent, matches });
      })
      .catch(error => {
        console.log(error);
        res.render("parent_details", { parent });
      });
  });

  //   const newParent = Object.assign(currentParent, {
  //     username,
  //     firstName,
  //     lastName,
  //     email,
  //     age,
  //     language,
  //     nationality,
  //     gender,
  //     ocupation,
  //     pictureUrl
  //   });

  // newParent
  //   .save()
  //   .then(parent => {
  //     Parent.find({ language: language })
  //       .then(matches => {
  //         res.render("parent_details", { parent, matches });
  //       })
  //       .catch(error => {
  //         console.log(error);
  //         res.render("parent_details", { parent });
  //       });
  //   })
  //   .catch(error => {
  //     console.log(error);
  //   });
});

//child route
router.get("/parent/:parentId/child", (req, res, next) => {
  res.render("child");
});

router.post("/child/add", (req, res, next) => {
  const { name, languages, age, gender } = req.body;
  const newChild = new Child({
    name,
    languages,
    age,
    gender
  });
  newChild.save().then(addedChild => {
    Parent.findOneAndUpdate(
      { _id: req.user._id },
      { $push: { child: addedChild } }
    ).then(() => console.log("child added"));
    Parent.find()
      .populate("child")
      .then(parents => {
        parents = parents.filter(parent => {
          const childAge = parent.child.map(child => child.age);

          return (
            childAge.includes(addedChild.age) &&
            parent._id.toString() != req.user._id.toString()
          );
        });
        res.render("child_details", { parents, addedChild });
      })

      .catch(error => {
        console.log(error);
      });
  });
});
//activity
router.get("/parent/:parentId/activity", (req, res, next) => {
  res.render("activity");
});
router.post("/activity/add", (req, res, next) => {
  const { location, activityType, time } = req.body;
  const newActivity = new Activity({
    location,
    activityType,
    time
  });
  newActivity
    .save()
    .then(activity => {
      res.render("activity_details", activity);
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;
