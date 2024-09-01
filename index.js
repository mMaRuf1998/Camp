
const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose')
const Campground = require('./models/campground');
const Review = require("./models/reviews")
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/wrapAround');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');
const { campgroundSchema, reviewSchema } = require('./schemas');
const { error } = require('console');
mongoose.connect('mongodb://localhost:27017/campdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => {
    console.log('Database connected');
});


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

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

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

app.get('/campgrounds/new', (req, res) => {
    res.render("campgrounds/new");

})


app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });

}))
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campgrounds._id}`);
}))
app.post('/campgrounds', validateCampground, catchAsync(async (req, res) => {

    const campgrounds = new Campground(req.body.campground);
    await campgrounds.save();
    res.redirect(`/campgrounds/${campgrounds._id}`)


}))


app.delete('/campgrounds/:id', catchAsync(async (req, res) => {

    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");


}))

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    //res.send("review page");
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    // console.log(review, "-----------");
    await review.save();
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    const hello = await Review.findByIdAndDelete(reviewId);
    console.log(hello)
    res.redirect(`/campgrounds/${id}`);
}))
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    //console.log(campground)
    res.render("campgrounds/show", { campground });
}))


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    //res.status(statusCode).send(message);
    if (!err.message)
        err.message = "Oh No , Something Went Wrong !";
    res.status(statusCode).render('error', { err });
    //res.send("Oh man !")
})



app.listen(3000, () => {
    console.log('Serving on Port 3000')
})

/*
    name 
    title

*/