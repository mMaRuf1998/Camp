const User = require("../models/user")


module.exports.renderRegister =  (req,res)=>{
    res.render("users/register") ; 
} 

module.exports.register = async(req,res)=>{
   
    try{
    const {email, username,password } = req.body ;
    const user = new User({email,username}) ;
    const registeredUser = await User.register(user,password) ;
    
    req.login(registeredUser, err => {
        if(err)
        {
            console.log(err)
            return next(err) ;
        }
        req.flash("success","Welcome to YelpCamp") ;
        res.redirect("/campgrounds")
    })
   
    }
    catch(e){
        req.flash("error", e.message) 
        res.redirect("/register")
    }
   
    
}

module.exports.renderLogin = (req,res) => {
    res.render("users/login")
}

module.exports.login = (req,res) => {
    req.flash("success" , "Welcome Back ! ") ;
    
    const redirectUrl = res.locals.returnTo || '/campgrounds'; 
    delete res.locals.returnTo ;

    res.redirect(redirectUrl)
}


module.exports.logout  = async (req,res)=>{
    req.logout((e)=>{
        if(e){
            return next(e) ;
        }
        req.flash('success' , "Logged Out") ; 
        res.redirect("/campgrounds")
    }
    )}