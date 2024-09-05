const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/wrapAround');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas');
const {isLoggedIn} = require("../middleware")

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



router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

router.get('/new', isLoggedIn , (req, res) => {
   
    res.render("campgrounds/new");
     
})


router.get('/:id/edit',isLoggedIn ,  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', "Campground not found !")
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });

}))
router.put('/:id', validateCampground, isLoggedIn,  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated a new Campground !');

    res.redirect(`/campgrounds/${campgrounds._id}`);
}))
router.post('/', validateCampground, isLoggedIn , catchAsync(async (req, res, next) => {
    const campgrounds = new Campground(req.body.campground);
    await campgrounds.save();
    req.flash('success', 'Successfully added a new Campground !');
    res.redirect(`/campgrounds/${campgrounds._id}`)


}))


router.delete('/:id', isLoggedIn , catchAsync(async (req, res) => {

    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('error', 'Successfully deleted a new Campground !');

    res.redirect("/campgrounds");


}))


router.get('/:id' , catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    if (!campground) {
        req.flash('error', "Campground not found !")
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show", { campground });
}))


module.exports = router;