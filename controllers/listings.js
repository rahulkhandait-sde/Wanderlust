const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {
    if (!req.body.listing) throw new ExpressError(400, "Invalid listing data");
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("");
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}

module.exports.updateListing = async (req, res) => {
    if (!req.body.listing) throw new ExpressError(400, "Invalid listing data");
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id); //req.params.id is the id of the listing to be deleted
    res.redirect("");
}