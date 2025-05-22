const Listing = require("./models/Listing.js");
const ExpressError = require("./ExpressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");
const Review = require("./models/Review.js");

module.exports.isLoggedIn = (req, res, next) => {
  console.log("Middleware isLoggedIn called");
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("failure", "You must be logged in to create a listing");
    return res.redirect("/login");
  }
  next();
};


module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl; // fixed line
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!res.locals.currUser || !listing.owner.equals(res.locals.currUser._id)) {
    req.flash("failure", "You are not the owner!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};


// Middleware to validate listing input
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(", ");
    console.error("Validation Error:", errMsg);
    req.flash("error", errMsg);
    return res.redirect("/listings/new");
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg)
  } else {
    next();
  };
};


module.exports.isreviewAuthor = async (req, res, next) => {
  const { id , reviewId} = req.params;
  const review = await Review.findById(reviewId);

  if (!res.locals.currUser || !review.author.equals(res.locals.currUser._id)) {
    req.flash("failure", "You are not the author!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};