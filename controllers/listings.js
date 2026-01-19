const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });



module.exports.index = async (req , res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
}



module.exports.renderNewForm = (req , res) => {
    res.render("listings/new.ejs");
}



module.exports.createListing = async (req , res) => {
    let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
    })
    .send()

    let url = req.file.path;
    let filename = req.file.filename
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url , filename};
    newListing.geometry = response.body.features[0].geometry;
    newListing.category = req.body.listing.category;
    await newListing.save();
    req.flash("success" , "New listing created"); // key: success , message: new listing created
    res.redirect("/listings");
}



module.exports.renderEditForm = async(req , res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error" , "The listing you requested for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs" , {listing});
}



module.exports.updateListing = async(req , res) => {
    let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
    })
    .send()

    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(
        id,
        {...req.body.listing},
        { runValidators: true, new: true }
    );
    listing.geometry = response.body.features[0].geometry;
    if(typeof req.file !== "undefined"){ // this runs when a new image is uploaded.
        let url = req.file.path;
        let filename = req.file.filename
        listing.image = {url , filename};
    }
    await listing.save();
    req.flash("success" , "Listing updated!");
    res.redirect(`/listings/${id}`);
}




module.exports.destroyListing = async(req , res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete({_id: `${id}`});
    req.flash("success" , "Listing deleted");
    res.redirect("/listings");
}




module.exports.showListing = async(req , res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews" , populate: {path: "author"}}).populate("owner"); // using nested populate here
    if(!listing){
        req.flash("error" , "The listing you requested for does not exist");
        return res.redirect("/listings"); // using return here so that the next lines after this dont execute
    }
    res.render("listings/show.ejs" , {listing});
}



module.exports.filterListing = async (req, res) => {
    const { category } = req.params;
    const allListings = await Listing.find({ category });
    res.render("listings/index.ejs", { allListings });
}



module.exports.searchCountry = async(req , res) => {
    let {country} = req.query;
    country = req.query.country.trim();
    // const allListings = await Listing.find({country});
    const allListings = await Listing.find({
        country: { $regex: `^${country}$`, $options: "i" }
    });
    if(allListings.length == 0){
        // res.render("listings/countryError.ejs" , {country});
        req.flash("error" , "No listings found for this country. Be the first to add one!");
        res.redirect("/listings");
    }
    else{
        res.render("listings/index.ejs" , {allListings});
    }
}