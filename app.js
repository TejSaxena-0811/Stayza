const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");



app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname , "/public")));




const MONGO_URL = "mongodb://127.0.0.1:27017/roamrest";
async function main(){
    await mongoose.connect(MONGO_URL);
}

main()
.then(() => {
    console.log("connected to db");
})
.catch((err) => {
    console.log(err);
})


// making the joi validations as a middleware function
const validateListing = (req , res , next) => {
    let {err} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 , errMsg);
    }
    else{
        next();
    }
}



app.get("/" , (req , res) => {
    res.send("root");
})


// INDEX ROUTE
app.get("/listings" , async (req , res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
})


// CREATE ROUTE
app.get("/listings/new" , (req , res) => {
    res.render("listings/new.ejs");
})

app.post("/listings" , validateListing , wrapAsync(async (req , res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();

    res.redirect("/listings");
}))




// EDIT ROUTE
app.get("/listings/:id/edit" , wrapAsync(async(req , res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs" , {listing});
}))

app.put("/listings/:id" , validateListing , wrapAsync(async(req , res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(
        id,
        {...req.body.listing},
        { runValidators: true, new: true }
    );
    res.redirect(`/listings/${id}`);
}))





// DELETE ROUTE
app.delete("/listings/:id" , wrapAsync(async(req , res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete({_id: `${id}`});
    res.redirect("/listings");
}))


// SHOW ROUTE
app.get("/listings/:id" , wrapAsync(async(req , res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs" , {listing});
}))



// if a request comes on a non-existing page
app.use((req , res , next) => {
    next(new ExpressError(404 , "Page Not Found!"));
})




app.use((err , req , res , next) => {
    let {status=500 , message="Something went wrong"} = err;
    res.status(status).render("errors/error.ejs" , {message});
    // res.status(status).send(message);
})



app.listen(3000 , () => {
    console.log("listening to port 3000");
})