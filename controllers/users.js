
const User = require("../models/User.js");

module.exports.signupRenderForm=(req, res) => {
  res.render("users/signup");
};

module.exports.signup=async (req, res,next) => {
  const { username, email, password } = req.body;
  try {
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        next(err);
      }
      req.flash("success", "Welcome to wanderlust");
      res.redirect("/listings");
    })
  } catch (e) {
    req.flash("failure", e.message);
    res.redirect("/signup");
  }
};

module.exports.loginRenderForm= (req, res) => {
  res.render("users/login")
};

module.exports.login=async (req, res) => {
   console.log("User after login:", req.user);
    req.flash("success", "Welcome back to Wanderlust!");
      console.log('Authenticated user:', req.user);
    let redirect= res.locals.redirectUrl || "/listings"
    return res.redirect(redirect);
  };

  module.exports.logout=(req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "You logged out successfully");
    res.redirect("/listings");
  });
};