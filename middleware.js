const Review = require("./models/review");


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){

    req.session.redirectUrl = req.originalUrl;    
    req.flash("error","Please login first to continue!");
    return res.redirect("/login");
   }
   next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    
    if (!review) {
      req.flash("error", "Review not found!");
      return res.redirect(`/listings/${id}`);
    }

    if (!res.locals.currUser) {
      req.flash("error", "You must be logged in!");
      return res.redirect("/login");
    }

    if (!review.author.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not the author of this review!");
      return res.redirect(`/listings/${id}`);
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error in isReviewAuthor middleware:", error);
    req.flash("error", "Something went wrong!");
    return res.redirect(`/listings/${id}`);
  }
};
