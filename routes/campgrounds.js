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






router.get('/', catchAsync(campgrounds.index))

router.get('/new', isLoggedIn , campgrounds.renderNewForm)


router.get('/:id/edit',isLoggedIn , isAuthor, catchAsync(campgrounds.renderEditForm))

router.put('/:id', validateCampground, isLoggedIn,isAuthor ,  catchAsync(campgrounds.updateCampground))
router.post('/', validateCampground, isLoggedIn , isAuthor , catchAsync(campgrounds.createCampground))


router.delete('/:id', isLoggedIn , isAuthor , catchAsync(campgrounds.deleteCampground))


router.get('/:id' , catchAsync(campgrounds.showCampground))


module.exports = router;