const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/wrapAround');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas');
const {isLoggedIn} = require("../middleware")
const campgrounds = require("../controllers/campgrounds")


const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join('.')
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}



router.get('/', catchAsync(campgrounds.index))

router.get('/new', isLoggedIn , campgrounds.renderNewForm)


router.get('/:id/edit',isLoggedIn ,  catchAsync(campgrounds.renderEditForm))

router.put('/:id', validateCampground, isLoggedIn,  catchAsync(campgrounds.updateCampground))
router.post('/', validateCampground, isLoggedIn , catchAsync(campgrounds.createCampground))


router.delete('/:id', isLoggedIn , catchAsync(campgrounds.deleteCampground))


router.get('/:id' , catchAsync(campgrounds.showCampground))


module.exports = router;