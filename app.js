if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}


require('dotenv').config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");
const session = require("express-session"); // Fixed step 1 --> require express-session
const flash = require("connect-flash");
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require("./models/user.js"); 
const user = require("./routes/user.js"); 


main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});
async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 *  24 * 60 * 60 * 1000,
        httpOnly: true, //prevents from cross scripting attacks ( security purpose only )

    }

};





// VALIDATE REVIEW ROUTE
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body, { abortEarly: false });
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        console.log("Validation Error:", errMsg);
        return next(new ExpressError(400, errMsg));
    }
    next();
};
// Root route
app.get("/", (req, res) => {
    res.send("Hi, I am root");
});
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize()); //a middleware that is used to initialize passport
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//middleware
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();// dont forget to call next, else will stuck in this middleware
})

// app.get("/demouser",async (req,res)=>{
//   let fakeUser = new User({
//     email: "student12@gmail.com",
//     username: "delta12-student",

//   });

//  let registeredUser =  User.register(fakeUser,"helloWorld");
//  res.send(registeredUser);

// })


app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", user);

// Error handling middleware
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.render("error.ejs", { message });
});

app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
