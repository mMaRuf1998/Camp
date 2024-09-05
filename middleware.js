const isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo  = req.originalUrl ;
        console.log(req.session.returnTo);
        req.flash("error", "You must be logged in !") ;
        return res.redirect("/login");
     }
    next() ;
}

const storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports = {isLoggedIn , storeReturnTo} ; 

