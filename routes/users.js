const express= require('express') ; 
const router = express.Router() ;
const User = require("../models/user")
const {storeReturnTo} = require("../middleware")
const catchAsync = require('../utils/wrapAround');
const passport = require("passport")
const users = require("../controllers/users")

router.get("/register" , users.renderRegister)

router.post("/register" , catchAsync(users.register))

router.get("/login" , users.renderLogin)

router.post("/login" , storeReturnTo , 
    passport.authenticate('local',
        {failureFlash:true ,failureRedirect:'/login'}) , 
        users.login)

router.get("/logout",users.logout)
    
module.exports = router