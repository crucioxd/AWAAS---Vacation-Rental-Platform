const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new mongoose.Schema({
    title: String,
    description: String,
    
    image: {
        url: { type: String, required: true },
        filename: { type: String, required: true },
    },
    


  
    price: {
        type: Number,
        required: true, // To align with Joi validation
        min: 0, // Ensures price cannot be negative
    },
    location: {
        type: String,
        required: true, // To align with Joi validation
    },
    country: {
        type: String,
        required: true, // To align with Joi validation
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review", // Ensures a relationship between Listing and Review
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref:"User",
    },
});

// Middleware to delete associated reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
