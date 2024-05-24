if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

// console.log(process.env.SECRET);


//////REQUIREMENTS//////
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const {listingSchema, reviewSchema} = require("./schema.js");

const listings = require("./routes/listings.js");

//////DATABASE//////
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.log("MongoDB connection unsuccessful");
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

//////MIDDLEWARE//////
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

//////ROUTES//////
//Root Route
// app.get("/", (req, res) => {
//   res.send("Hi, I am root!");
// });


app.use("/listings", listings);

//////TESTING//////
// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("Sample was saved");
//   res.send("Listing saved successfully");
// });

/////ERROR HANDLING//////

//404 Error
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

//////LISTENER//////
app.listen(8080, () => {
  console.log("App listening on port 8080");
});
