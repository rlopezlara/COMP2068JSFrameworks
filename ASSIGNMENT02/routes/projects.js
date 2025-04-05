var express = require("express");
var router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Project = require("../models/project");

// Resusable Function to check if the user is authenticated
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); //Continue to the next function in the request chain
  }
  res.redirect("/login"); // not authenticated, redirect to login
}

// Configure multer storage
// This will store the uploaded files in the public/images directory with a unique name
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/"); // store in public folder
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
// Initialize multer with the storage configuration
// This will handle file uploads in the request body
const upload = multer({ storage: storage });

//GET/projects
router.get("/", async (req, res, next) => {
  let projects = await Project.find().sort({ dueDate: 1 });

  res.render("projects/index", {
    title: "Travel Blog",
    dataset: projects,
    user: req.user,
  });
});

//GET/projects/add
router.get("/add", isLoggedIn, async (req, res, next) => {
  res.render("projects/add", {
    title: "Add a new place",
    user: req.user,
  });
});

// POST /projects/add
router.post(
  "/add",
  isLoggedIn,
  upload.single("image"),
  async (req, res, next) => {
    let stars = parseInt(req.body.stars, 10);

    // Validate stars input
    if (isNaN(stars) || stars < 0 || stars > 5) {
      return res.status(400).send("Stars must be a number between 0 and 5.");
    }
    let imageUrl = req.file ? "/images/" + req.file.filename : null;

    let newProject = new Project({
      country: req.body.country,
      city: req.body.city,
      visitDate: req.body.visitDate,
      stars: stars,
      description: req.body.description,
      imageUrl: imageUrl,
    });
    await newProject.save();
    res.redirect("/projects");
  }
);

// GET / projects /delete

router.get("/delete/:_id", isLoggedIn, async (req, res, next) => {
  let projectId = req.params._id;
  //Check if there's an image and delete it
  let project = await Project.findById(projectId);

  if (project.imageUrl) {
    const imagePath = path.join(__dirname, "..", "public", project.imageUrl); // Get full image path
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error deleting image: ", err);
        // Optionally handle this error in your UI
      }
    });
  }

  await Project.findByIdAndDelete(projectId);

  res.redirect("/projects");
});

// GET / projects /edit

router.get("/edit/:_id", isLoggedIn, async (req, res, next) => {
  let projectId = req.params._id;
  let projectData = await Project.findById(projectId);

  res.render("projects/edit", {
    title: "Edit Project",
    project: projectData,
    user: req.user,
  });
});

// POST /projects/edit
router.post(
  "/edit/:_id",
  isLoggedIn,
  upload.single("image"),
  async (req, res, next) => {
    let projectId = req.params._id;
    const stars = parseInt(req.body.stars, 10);

    if (isNaN(stars) || stars < 0 || stars > 5) {
      return res.status(400).send("Stars must be a number between 0 and 5.");
    }

    //  Fetch the existing project
    let existingProject = await Project.findById(projectId);

    //  Use new image if uploaded, otherwise keep existing one
    let updatedImageUrl = req.file
      ? "/images/" + req.file.filename
      : existingProject.imageUrl;

    //  Update the project
    await Project.findByIdAndUpdate(
      { _id: projectId },
      {
        country: req.body.country,
        city: req.body.city,
        visitDate: req.body.visitDate,
        stars: stars,
        description: req.body.description,
        imageUrl: updatedImageUrl,
      }
    );

    res.redirect("/projects");
  }
);

module.exports = router;
