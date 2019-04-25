const express = require("express");
const passport = require("passport");
const router = express.Router();

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const Parent = require("../models/parent");
const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser(function(user, done) {
  done(null, user._id);
  // if you use Model.id as your idAttribute maybe you'd want
  // done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Parent.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy(function(username, password, done) {
    Parent.findOne({ username: username }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    });
  })
);

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/registration",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  const { username, password, email } = req.body;
  if (username === "" || password === "" || email === "") {
    res.render("signup", { message: "Indicate username and password" });
    return;
  }

  Parent.findOne({ username }, "username", (err, user) => {
    console.log(user);
    if (user !== null) {
      res.render("signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newParent = new Parent({
      username,
      email,
      password: hashPass
    });

    newParent
      .save()
      .then(parent => {
        res.redirect("/login");
      })
      .catch(err => {
        console.error("Error saving new parent", err);
        res.render("signup", { message: "Something went wrong" });
      });
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
