const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");



const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");




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




const sessionOptions = {
    secret: "mysecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + (7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};




app.get("/" , (req , res) => {
    res.send("root");
})




app.use(session(sessionOptions));
app.use(flash());

app.use((req , res , next) => {
    res.locals.success = req.flash("success"); // using this success variable in flash.ejs
    res.locals.error = req.flash("error");
    next();
})




app.use("/listings" , listings);
app.use("/listings/:id/reviews" , reviews);





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