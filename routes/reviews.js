const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Review = require("../models/reviews")
const catchAsync = require('../utils/wrapAround');
const ExpressError = require('../utils/ExpressError');
const { reviewSchema } = require('../schemas');


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join('.')
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'New review posted !');

    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    const hello = await Review.findByIdAndDelete(reviewId);
    req.flash('error', 'Succesfully , deleted review !');
    res.redirect(`/campgrounds/${id}`);
}))


module.exports = router;