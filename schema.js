const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required(),
        image: Joi.object({
            url: Joi.string().uri().required() // Validate as a valid URL
        }).required() // Ensure `image` itself is required
    }).required() // Ensure `listing` object is required
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required() // Ensure `review` object is required
});
