const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/wrapAround');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas');
const {isLoggedIn} = require("../middleware")
const {isAuthor} = require("../middleware")
const {validateCampground} = require("../middleware")
const campgrounds = require("../controllers/campgrounds")
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })



router.route("/")
    .get(catchAsync(campgrounds.index))
    //.post(isLoggedIn , validateCampground , catchAsync(campgrounds.createCampground))
    .post(upload.single('image'),(req,res)=>{
       console.log(req.body , req.file)

       res.send("WOAH !")
    })


router.get('/new', isLoggedIn , campgrounds.renderNewForm)

router.route("/:id")
    .get(catchAsync(campgrounds.showCampground))
    .put(validateCampground, isLoggedIn,isAuthor ,  catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn , isAuthor , catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit',isLoggedIn , isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router;