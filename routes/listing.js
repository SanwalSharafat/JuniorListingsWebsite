const express = require("express");
const router = express.Router();
const asyncWrap = require('../asyncWrap');
const Listing = require("../models/Listing.js");
const ExpressError = require("../ExpressError");
const { isLoggedIn,isOwner,validateListing } = require("../middleware.js");
const listingController= require("../controllers/listings.js");

// router.route("/")
//   .get(asyncWrap(listingController.index))
//   .post(
//     isLoggedIn,
//     validateListing, 
//     asyncWrap(listingController.createListing)
//   );


  // Index route
router.get("/", asyncWrap(listingController.index));

// Create route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  asyncWrap(listingController.createListing)
);
// NEW ROUTE
router.get("/new", isLoggedIn, listingController.renderNewForm);

// EDIT ROUTE
router.get('/:id/edit', isLoggedIn, isOwner,
  asyncWrap(listingController.editListing)
);



// SHOW ROUTE

router.get("/:id", asyncWrap(listingController.showLising));


// UPDATE ROUTE

router.put("/:id", isLoggedIn, isOwner,
   validateListing, asyncWrap(listingController.updateListing));


// DELETE ROUTE
router.delete('/:id', isLoggedIn, isOwner,
  asyncWrap(listingController.deleteListing)
);

module.exports = router;
