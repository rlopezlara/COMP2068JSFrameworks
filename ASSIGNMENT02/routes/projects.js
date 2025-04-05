var express = require("express");
var router = express.Router();

const Project = require("../models/project");

// Resusable Function to check if the user is authenticated
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); //Continue to the next function in the request chain
  }
  res.redirect("/login"); // not authenticated, redirect to login
}

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
router.post("/add", isLoggedIn, async (req, res, next) => {
  let stars = parseInt(req.body.stars, 10);

  // Validate stars input
  if (isNaN(stars) || stars < 0 || stars > 5) {
    return res.status(400).send("Stars must be a number between 0 and 5.");
  }

  let newProject = new Project({
    country: req.body.country,
    city: req.body.city,
    visitDate: req.body.visitDate,
    stars: stars,
    description: req.body.description,
  });
  await newProject.save();
  res.redirect("/projects");
});

// GET / projects /delete

router.get("/delete/:_id", isLoggedIn, async (req, res, next) => {
  let projectId = req.params._id;
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

// POST / projects /edit
router.post("/edit/:_id", isLoggedIn, async (req, res, next) => {
  let projectId = req.params._id;
  const stars = parseInt(req.body.stars, 10);

  if (isNaN(stars) || stars < 0 || stars > 5) {
    return res.status(400).send("Stars must be a number between 0 and 5.");
  }

  await Project.findByIdAndUpdate(
    { _id: projectId },
    {
      country: req.body.country,
      city: req.body.city,
      visitDate: req.body.visitDate,
      stars: stars,
      description: req.body.description,
    }
  );
  res.redirect("/projects");
});

module.exports = router;
