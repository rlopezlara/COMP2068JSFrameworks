var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user"); // Import the User model
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Home" });
});

// GET /login - page load
router.get("/login", function (req, res, next) {
  let messages = req.session.messages || [];
  req.session.messages = [];
  res.render("login", { title: "login", messages: messages, user: req.user });
});

//Get /register - page load
router.get("/register", function (req, res, next) {
  res.render("register", { title: "Create a new account", user: req.user });
});

// POST // register - users enters new user credentials and clicks submit
router.post("/register", function (req, res, next) {
  // Use the model to create a new user in the database
  User.register(
    new User({ username: req.body.username }), // user object
    req.body.password, // password separately to encrypt it
    function (err, user) {
      if (err) {
        console.log(err);
        return res.redirect("/register");
      } else {
        req.login(user, (err) => {
          res.redirect("/projects");
        });
      }
    }
  );
});

// POST /login - user enters credentials and clicks submit
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/projects", //Where to go if login is successfull
    failureRedirect: "/login", // where to go if login fails
    failureMessage: "Invalid Credentials", // additional message for login failure
  })
);
// GET /logout - log out the user and redirect to the home page
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    res.redirect("/login");
  });
});

// Get handler for /github
// This route will redirect the user to GitHub for authentication
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user.email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/projects");
  }
);
module.exports = router;
