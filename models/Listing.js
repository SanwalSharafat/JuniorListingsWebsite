const mongoose = require("mongoose");
const Review = require("./Review");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      required: true,
      default: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
      validate: {
        validator: (url) => url.startsWith("http://") || url.startsWith("https://"),
        message: "Invalid image URL",
      },
    },
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  reviews: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Review"
  }
],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
