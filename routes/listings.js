const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
// const {listingSchema, reviewSchema} = require("../schemas.js");
const Listing = require("../models/listing.js");


const validateListing = (req, res, next) => {
    let{error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


//Index Route
router.get(
    "",
    wrapAsync(async (req, res) => {
      const allListings = await Listing.find({});
      res.render("listings/index.ejs", { allListings });
    })
  );
  
  //New Route
  router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
  });
  
  //Show Route
  router.get(
    "/:id",
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id);
      res.render("listings/show.ejs", { listing });
    })
  );
  
  //Create Route
  router.post(
    "",
    wrapAsync(async (req, res, next) => {
      if (!req.body.listing) throw new ExpressError(400, "Invalid listing data");
      const newListing = new Listing(req.body.listing);
      await newListing.save();
      res.redirect("");
    })
  );
  
  //Edit Route
  router.get(
    "/:id/edit",
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id);
      res.render("listings/edit.ejs", { listing });
    })
  );
  
  //Update Route
  router.put(
    "/:id",
    wrapAsync(async (req, res) => {
      if (!req.body.listing) throw new ExpressError(400, "Invalid listing data");
      let { id } = req.params;
      await Listing.findByIdAndUpdate(id, { ...req.body.listing });
      res.redirect(`/${id}`);
    })
  );
  
  //Delete Route
  router.delete(
    "/:id",
    wrapAsync(async (req, res) => {
      await Listing.findByIdAndDelete(req.params.id); //req.params.id is the id of the listing to be deleted
      res.redirect("");
    })
  );

module.exports = router;