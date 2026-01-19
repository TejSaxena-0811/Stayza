const express = require("express");
const router = express.Router({mergeParams: true});
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");


const userController = require("../controllers/users.js");



router.get("/signup" , userController.renderSignUpForm);


router.post("/signup" , wrapAsync(userController.signUp));




router.get("/login" , userController.renderLogInForm);



router.post("/login" , saveRedirectUrl , passport.authenticate("local" , {failureRedirect: "/login" , failureFlash: true}) , userController.logIn);



router.get("/logout" , userController.logOut);




module.exports = router;