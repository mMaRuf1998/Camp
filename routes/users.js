const express= require('express') ; 
const router = express.Router() ;
const User = require("../models/user")
const {storeReturnTo} = require("../middleware")
const catchAsync = require('../utils/wrapAround');
const passport = require("passport")

router.get("/register" , (req,res)=>{
    res.render("users/register") ; 
})

router.post("/register" , catchAsync(async(req,res)=>{
   
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
   
    
}))

router.get("/login" , (req,res) => {
    res.render("users/login")
})

router.post("/login" , storeReturnTo , passport.authenticate('local',{failureFlash:true ,failureRedirect:'/login'}) , (req,res) => {
    req.flash("success" , "Welcome Back ! ") ;
    
    const redirectUrl = res.locals.returnTo || '/campgrounds'; 
    delete res.locals.returnTo ;

    res.redirect(redirectUrl)
})

router.get("/logout",async (req,res)=>{
    req.logout((e)=>{
        if(e){
            return next(e) ;
        }
        req.flash('success' , "Logged Out") ; 
        res.redirect("/campgrounds")
    })
    
})
module.exports = router