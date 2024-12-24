const Listing = require('../models/listing'); // Ensure this is correctly imported
const Review = require('../models/review');
const User = require('../models/user');

module.exports.getSignup = (req, res) => {
    res.render("users/signup.ejs"); 
  };

module.exports.postSignup = async (req, res) => {
    try {
      const { username, email, password } = req.body; 
      if (!username || !email || !password) {
        req.flash("error", "All fields are required!");
        return res.redirect("/signup");
      }
      
      const newUser = new User({ email, username }); 
      const registeredUser = await User.register(newUser, password); 
      console.log(registeredUser);
      req.login(registeredUser,(err)=>{
        if(err){
          return next(err);
        }
        req.flash("success", "Welcome to Awaas!"); //
        res.redirect("/listings"); 
      });
     
    } catch (err) {
      console.error(err);
      req.flash("error", err.message); 
      res.redirect("/signup");
    }
  }

  module.exports.getLogin =(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.postLogin = async(req,res)=>{ //passport provides an aunthentication middleware which can be used as middlewware to aunthenticate the user 
    req.flash("success","Welcome Back to Awaas!");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
  }

module.exports.getLogout = (req,res)=>{
    req.logout((err)=>{
      if(err){
        next(err);
      }
      req.flash("success","you are successfully logged out!");
      res.redirect("/listings");
    })
  }