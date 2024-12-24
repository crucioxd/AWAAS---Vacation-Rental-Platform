const Listing = require('../models/listing');
const Review = require('../models/review');

module.exports.postReview = async (req, res) => {
    console.log("Request Body:", req.body); // Log the incoming request body

    try {
        // Fetch the listing using the Listing model
        let listing = await Listing.findById(req.params.id); 
        if (!listing) {
            return res.status(404).send("Listing not found");
        }

        // Create a new review instance
        let newReview = new Review(req.body.review);
        newReview.author = req.user._id; // Assign the author
        console.log(newReview);

        // Push the new review into the listing's reviews array
        listing.reviews.push(newReview);

        // Save the review and the listing
        await newReview.save();
        await listing.save();

        // Flash a success message and redirect
        req.flash("success", "New Review Created!");
        res.redirect(`/listings/${listing._id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong");
    }
};



module.exports.deleteForm = async (req, res) => {
    try {
        const { id, reviewId } = req.params;

        // Verify if the user is the author of the review (use middleware for better modularity)
        const review = await Review.findById(reviewId);
        if (!review) {
            req.flash("error", "Review not found.");
            return res.redirect(`/listings/${id}`);
        }

        if (!review.author.equals(req.user._id)) {
            req.flash("error", "You are not authorized to delete this review.");
            return res.redirect(`/listings/${id}`);
        }

        // Remove the review from the listing and delete the review
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);

        req.flash("success", "Review deleted successfully.");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error("Error in deleteForm:", error);
        req.flash("error", "Something went wrong while deleting the review.");
        res.redirect(`/listings/${id}`);
    }
};
