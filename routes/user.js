const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const ExpressError = require("../ExpressError.js");
const asyncWrap = require('../asyncWrap');
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController= require("../controllers/users.js");

router.use((req, res, next) => {
  console.log("Current logged in user:", req.user ? req.user.username : "None");
  next();
});


router.get("/signup", userController.signupRenderForm);

router.post("/signup", asyncWrap(userController.signup));

router.get("/login", userController.loginRenderForm);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

router.get("/logout", userController.logout);

module.exports = router;


