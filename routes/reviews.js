const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../schema.js")
const Review = require("../models/review.js")
const Listing = require("../models/listing.js")
const {isLoggedIn} = require("../middleware.js");  
const {isReviewAuthor} = require("../middleware.js"); 
const reviewController = require("../controllers/reviews.js");

//VALIDATE REVIEW ROUTE
const validateReview = (req, res, next) => {
    // Validate the request body against the review schema
    let { error } = reviewSchema.validate(req.body, { abortEarly: false }); // Collect all errors

    if (error) {
        // Extract all error messages and join them into a single string
        let errMsg = error.details.map((el) => el.message).join(", ");
        console.log("Validation Error:", errMsg); // Log error for debugging purposes

        // Pass the error to the ExpressError handler
        return next(new ExpressError(400, errMsg));
    }

    // If validation passes, continue to the next middleware
    next();
};

//REVIEW ROUTE
//post route 

router.post("/",isLoggedIn, validateReview, reviewController.postReview);


  //delete review route
  router.delete("/:reviewId", isReviewAuthor,isLoggedIn,wrapAsync(reviewController.deleteForm));
module.exports = router;