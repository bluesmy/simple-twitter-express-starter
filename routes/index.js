const express = require("express");
const router = express.Router();
const helpers = require("../_helpers");

const userController = require("../controllers/userController.js");
const tweetController = require("../controllers/tweetController.js");

const passport = require("../config/passport");

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next();
  }
  req.flash("error_messages", "請先登入才能使用");
  res.redirect("/signin");
};

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()
router.get("/", authenticated, (req, res) => res.redirect("/tweets"));
router.get("/tweets", authenticated, tweetController.getTweets);

router.get("/signup", userController.signUpPage);
router.post("/signup", userController.signUp);

router.get("/signin", userController.signInPage);
router.post(
  "/signin",
  passport.authenticate("local", {
    failureRedirect: "/signin",
    failureFlash: true
  }),
  userController.signIn
);
router.get("/logout", userController.logout);

router.get("/users/:id/tweets", authenticated, userController.getUser);

module.exports = router;
