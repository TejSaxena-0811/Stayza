const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");



// making the joi validations as a middleware function (for validating new listings)
const validateListing = (req , res , next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 , errMsg);
    }
    else{
        next();
    }
}




// INDEX ROUTE
router.get("/" , async (req , res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
})


// CREATE ROUTE
router.get("/new" , (req , res) => {
    res.render("listings/new.ejs");
})

router.post("/" , validateListing , wrapAsync(async (req , res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success" , "New listing created"); // key: success , message: new listing created
    res.redirect("/listings");
}))




// EDIT ROUTE
router.get("/:id/edit" , wrapAsync(async(req , res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error" , "The listing you requested for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs" , {listing});
}))

router.put("/:id" , validateListing , wrapAsync(async(req , res) => {
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
router.delete("/:id" , wrapAsync(async(req , res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete({_id: `${id}`});
    req.flash("success" , "Listing deleted");
    res.redirect("/listings");
}))


// SHOW ROUTE
router.get("/:id" , wrapAsync(async(req , res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error" , "The listing you requested for does not exist");
        return res.redirect("/listings"); // using return here so that the next lines after this dont execute
    }
    res.render("listings/show.ejs" , {listing});
}))



module.exports = router;