const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");
const mongoose = require('mongoose');
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

mongoose.set('strictPopulate', false);

// Validation Middleware
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};

// Routes
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single("image"), // Match the frontend field name
        wrapAsync(listingController.createForm) // Move image handling logic to controller
    );

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showForm))
    .put(
        isLoggedIn,
        upload.single("image"), // File upload middleware for updates
        wrapAsync(listingController.updateForm) // Move image handling logic to controller
    )
    .delete(isLoggedIn, wrapAsync(listingController.deleteForm));

router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.editForm));

module.exports = router;
