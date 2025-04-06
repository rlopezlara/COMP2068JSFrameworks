var createError = require("http-errors");
var express = require("express");
var path = require("path");
const hbs = require("hbs");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
// Import dotenv to use environment variables
require("dotenv").config();
// Import configurations file and mongoose to connect to DB
var configs = require("./configs/globals");
var mongoose = require("mongoose");
//import express and passport
var passport = require("passport");
var session = require("express-session");
//Import model and package for authentication strategy
var User = require("./models/user");
var githubStrategy = require("passport-github2").Strategy;

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var projectsRouter = require("./routes/projects");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
hbs.registerHelper("toShortDate", function (date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-CA");
});
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// configuration session and passport here
app.use(
  session({
    secret: "TravelBlogWebApp",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
//Todo implement basic authentication strategy with passport-local and mongoose models.
passport.use(User.createStrategy());

// configure Github Oath Strategy
passport.use(
  new githubStrategy(
    {
      clientID: configs.GithubAuth.clientId,
      clientSecret: configs.GithubAuth.clientSecret,
      callbackURL: configs.GithubAuth.callbackUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await User.findOne({ oauthId: profile.id });
      if (user) {
        return done(null, user);
      } else {
        const newUser = new User({
          username: profile.username,
          oauthId: profile.id,
          oauthProvider: "Github",
          created: Date.now(),
        });
        const savedUser = await newUser.save();
        return done(null, savedUser);
      }
    }
  )
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//Routing Rules
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/projects", projectsRouter);
// serve static files for leaflet
app.use(
  "/leaflet",
  express.static(path.join(__dirname, "node_modules/leaflet/dist"))
);

// connect to MongoDB
mongoose
  .connect(process.env.CONNECTION_STRING_MONGODB)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB!", err);
  });
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
