const Listing = require("../models/Listing.js");

module.exports.index = async (req, res) => {
    const listings = await Listing.find({});

    if (!listings.length) {
        throw new ExpressError(404, "Listings not found");
    }

    const uniqueListingsMap = new Map();
    listings.forEach(listing => {
        if (!uniqueListingsMap.has(listing.title)) {
            uniqueListingsMap.set(listing.title, listing);
        }
    });

    const uniqueListings = Array.from(uniqueListingsMap.values());
    return res.render("index", { listings: uniqueListings });
}; 


module.exports.renderNewForm=(req, res) => {
  res.render("new.ejs");
};

module.exports.createListing=async (req, res) => {
  try {
    console.log("Creating listing with data:", req.body.listing);
    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    await listing.save();
    req.flash("success", "New Listing Created Successfully!");
    res.redirect("/listings");
  } catch (err) {
    console.error("Error saving listing:", err);
    req.flash("error", "Failed to create listing");
    res.redirect("/listings/new");
  }
};

module.exports.showLising=async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id).
  populate({path:"reviews",
    populate:{
      path:"author"
    }
  }).populate("owner");

  if (!listing) {
    console.error(`Listing with ID ${id} not found`);
    req.flash("failure", "The listing you found does not exist");
    return res.redirect("/listings");
  }

  console.log("Listing found:", listing);
  return res.render("show", { listing });
};

module.exports.editListing=async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("failure", "Listing not found");
      return res.redirect("/listings");
    }
    return res.render('edit', { listing });

  };

  module.exports.updateListing=async (req, res) => {
  console.log("Update route hit");
  console.log("Received update data:", req.body.listing);

  const { id } = req.params;
  const updatedData = req.body.listing;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("failure", "Listing not found");
    return res.redirect("/listings");
  }
  console.log("Found listing:", listing);

  listing.title = updatedData.title;
  listing.description = updatedData.description;
  listing.price = updatedData.price;
  listing.location = updatedData.location;
  listing.country = updatedData.country;

  if (updatedData.image && updatedData.image.url) {
    listing.image.url = updatedData.image.url;
  }
  await listing.save();
  console.log("Saved updated listing");

  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteListing=async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      throw new ExpressError(404, "Listing not found for deletion");
    }

    req.flash("success", "Listing Deleted Successfully!");
    return res.redirect('/listings');
  };