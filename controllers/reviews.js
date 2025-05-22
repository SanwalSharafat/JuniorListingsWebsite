const Listing = require("../models/Listing.js");
const Review = require("../models/Review.js");

module.exports.createReview=async (req, res) => {
      console.log("Current user:", req.user);
    const listing = await Listing.findById(req.params.id).populate("reviews");;
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created");

    res.redirect(`/listings/${listing._id}`);

  };

  module.exports.deleteReview=async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
};