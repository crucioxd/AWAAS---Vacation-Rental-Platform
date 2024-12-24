const Listing = require('../models/listing');

module.exports.index = async (req,res)=>{ //route definition
    const allListings= await Listing.find({});  //fetching data
    res.render("listings/index.ejs",{allListings});    

      }

module.exports.renderNewForm = (req,res)=>{
   
    res.render("listings/new.ejs");
}     

module.exports.showForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }

    // Filter out invalid or null reviews and authors
    listing.reviews = listing.reviews.filter((review) => review.author);

    res.render("listings/show.ejs", { listing });
}

module.exports.createForm = async (req, res, next) => {
  try {
      console.log("Request Body:", req.body);
      console.log("Uploaded File:", req.file);

      // Validate if listing data exists
      if (!req.body.listing) {
          req.flash("error", "Invalid data format. 'listing' key is missing.");
          return res.redirect("/listings/new");
      }

      // Extract file details
      const image = {
          url: req.file?.path || "/images/default.jpg", // Default URL if no image uploaded
          filename: req.file?.filename || "default.jpg",
      };

      // Create new listing
      const newListing = new Listing({
          ...req.body.listing, // Other listing details
          owner: req.user._id, // Current user as owner
          image, // Assign image object
      });

      await newListing.save(); // Save listing in database

      req.flash("success", "New listing created!");
      res.redirect("/listings");
  } catch (err) {
      console.error("Error during listing creation:", err);
      req.flash("error", "An error occurred while creating the listing.");
      next(err); // Pass error to global error handler
  }
};

  

module.exports.editForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested does not exist!");
      res.redirect("/listings");
      }
  
    res.render("listings/edit.ejs", { listing });
}

module.exports.updateForm = async (req, res, next) => {
  try {
      const { id } = req.params;

      // Find the listing and verify ownership
      const listing = await Listing.findById(id);
      if (!listing) {
          req.flash("error", "Listing not found!");
          return res.redirect("/listings");
      }

      if (!listing.owner.equals(req.user._id)) {
          req.flash("error", "You don't have permission to edit this listing.");
          return res.redirect(`/listings/${id}`);
      }

      // Handle file upload (if a new image is provided)
      const updatedData = { ...req.body.listing }; // Start with the updated fields
      if (req.file) {
          updatedData.image = {
              url: req.file.path, // New image URL
              filename: req.file.filename, // New image filename
          };
      }

      // Update the listing in the database
      await Listing.findByIdAndUpdate(id, updatedData, { runValidators: true });

      req.flash("success", "Listing updated successfully!");
      res.redirect(`/listings/${id}`);
  } catch (err) {
      console.error("Error during listing update:", err);
      req.flash("error", "An error occurred while updating the listing.");
      next(err); // Pass error to global error handler
  }
};


module.exports.deleteForm =async(req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}