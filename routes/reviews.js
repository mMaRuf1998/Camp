const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Review = require("../models/reviews")
const catchAsync = require('../utils/wrapAround');
const ExpressError = require('../utils/ExpressError');
const { reviewSchema } = require('../schemas');
const reviews = require("../controllers/reviews")
const {validateReview , isLoggedIn , isAuthor , isReviewAuthor} = require("../middleware") 


router.post('/', isLoggedIn , validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId',isLoggedIn , isReviewAuthor , catchAsync(reviews.deleteReview))


module.exports = router;