const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner , validateListing} = require("../middleware.js");







// INDEX ROUTE
router.get("/" , async (req , res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
})


// CREATE ROUTE
router.get("/new" , isLoggedIn ,  (req , res) => {
    res.render("listings/new.ejs");
})

router.post("/" , isLoggedIn ,  validateListing , wrapAsync(async (req , res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success" , "New listing created"); // key: success , message: new listing created
    res.redirect("/listings");
}))




// EDIT ROUTE
router.get("/:id/edit" , isLoggedIn , isOwner , wrapAsync(async(req , res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error" , "The listing you requested for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs" , {listing});
}))

router.put("/:id" , isLoggedIn , isOwner , validateListing , wrapAsync(async(req , res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(
        id,
        {...req.body.listing},
        { runValidators: true, new: true }
    );
    req.flash("success" , "Listing updated!");
    res.redirect(`/listings/${id}`);
}))





// DELETE ROUTE
router.delete("/:id" , isLoggedIn , isOwner , wrapAsync(async(req , res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete({_id: `${id}`});
    req.flash("success" , "Listing deleted");
    res.redirect("/listings");
}))


// SHOW ROUTE
router.get("/:id" , wrapAsync(async(req , res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews" , populate: {path: "author"}}).populate("owner"); // using nested populate here
    if(!listing){
        req.flash("error" , "The listing you requested for does not exist");
        return res.redirect("/listings"); // using return here so that the next lines after this dont execute
    }
    res.render("listings/show.ejs" , {listing});
}))



module.exports = router;