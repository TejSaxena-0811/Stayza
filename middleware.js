module.exports.isLoggedIn = (req , res , next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl; // if a non-loggedin user clicks on a path, and is redirected to the login page, then after login, they should be redirected to the page they were trying to access.
        req.flash("error" , "You must be logged in to work with a listing.");
        return res.redirect("/login");
    }
    next();
}



module.exports.saveRedirectUrl = (req , res , next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}