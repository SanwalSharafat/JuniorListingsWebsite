const express = require("express");
const path = require("path");
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/Listing.js");
const listingsData = require('./init.js');
const ejsMate = require("ejs-mate");
const ExpressError = require("./ExpressError.js");
const asyncWrap = require('./asyncWrap');
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/Review.js");
const passport = require("passport");

const User=require("./models/User.js");
require('dotenv').config();
const LocalStrategy = require("passport-local").Strategy;


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter= require("./routes/user.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const dbUrl=process.env.ATLASDB_URL;

async function main() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB Host:", mongoose.connection.host);
    // console.log("MongoDB connected");
  }
}

main().catch(err => console.log(err));

let port = 8080;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const methodOverride = require('method-override');
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const { renameSync } = require("fs");

const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24 * 3600,

});

store.on("error", ()=>{
  console.log("Error in session store", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,

  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
};



app.use(session(sessionOptions));
app.use(flash());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//passport
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.failure = req.flash("failure");
  res.locals.currUser=req.user;
  next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("error", { status, message });
});




app.listen(port, () => {
  console.log(`The server is running at port: ${port}`);
});