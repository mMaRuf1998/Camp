const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose')
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require("connect-flash")
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');
const { error } = require('console');
const passport = require('passport') ;
const LocalStrategy = require("passport-local")
const User = require('./models/user')
const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

mongoose.connect('mongodb://localhost:27017/campdb', {

})


const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => {
    console.log('Database connected');
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const sessionConfig = {
    secret: "thisissecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 3600 * 24 * 7,
        maxAge: 1000 * 3600 * 24 * 7
    }
}
app.use(session(sessionConfig));

app.use(flash());
app.use(passport.session()) ;
app.use(passport.initialize()) ;

passport.use(new LocalStrategy(User.authenticate()))  

passport.serializeUser(User.serializeUser()) ; 
passport.deserializeUser(User.deserializeUser()) ; 

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));



app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);




app.get("/fakeuser" ,async (req,res)=>{
    const user = new User({
        email:'Marufhsmed@gmail.com' ,
        username: "Maruff" , 
    })

    const newUser = await User.register(user,"122333") ;
    res.send(newUser) ;
})

app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message)
        err.message = "Oh No , Something Went Wrong !";
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('Serving on Port 3000')
})

