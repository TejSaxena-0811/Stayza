const User = require("../models/user");


module.exports.renderSignUpForm = (req , res) => {
    res.render("users/signup.ejs");
}



module.exports.signUp = async(req , res) => {
    try{
        let{username , email , password} = req.body;
        const newUser = new User({email , username});
        const registeredUser = await User.register(newUser , password);
        // automatic login after signup:
        req.login(registeredUser , (err) => {
            if(err){
                return next(err);
            }
            req.flash("success" , "Welcome to Stayza!");
            res.redirect("/listings");
        })
    }
    catch(err){
        req.flash("error" , err.message);
        res.redirect("/signup");
    }
}




module.exports.renderLogInForm = (req , res) => {
    res.render("users/login.ejs");
}



module.exports.logIn = async(req , res) => {
    req.flash("success" , "Welcome back!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}



module.exports.logOut = (req , res , next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success" , "You are logged out now.");
        res.redirect("/listings");
    })
}