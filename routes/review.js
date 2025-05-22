const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../ExpressError.js");
const asyncWrap = require('../asyncWrap');
const Listing = require("../models/Listing.js");
const Review = require("../models/Review.js");
// const { listingSchema } = require("../schema.js");
const { validateReview, isLoggedIn,isreviewAuthor } = require("../middleware.js");
const reviewController= require("../controllers/reviews.js");

//review route

router.post("/", isLoggedIn,
  validateReview, asyncWrap(reviewController.createReview));

//Delete Review route

// In routes/reviews.js (or similar file)
router.delete('/:reviewId',
  isLoggedIn,
  isreviewAuthor,
   asyncWrap(reviewController.deleteReview));


module.exports = router;