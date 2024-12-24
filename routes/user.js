const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require('../controllers/users.js');

// Routes for '/signup'
router.route("/signup")
    .get(userController.getSignup)
    .post(userController.postSignup);

// Routes for '/login'
router.route("/login")
    .get(userController.getLogin)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }),
        userController.postLogin
    );

// Route for '/logout'
router.route("/logout")
    .get(userController.getLogout);

module.exports = router;
