const bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.User;
const Tweet = db.Tweet;
const Like = db.Like;
const helpers = require("../_helpers");

const userController = {
  signUpPage: (req, res) => {
    return res.render("signup");
  },

  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash("error_messages", "請輸入相同密碼");
      return res.redirect("/signup");
    } else {
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash("error_messages", "此信箱已註冊");
          return res.redirect("/signup");
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
          }).then(user => {
            req.flash("success_messages", "註冊完成，請登入才能使用");
            return res.redirect("/signin");
          });
        }
      });
    }
  },

  signInPage: (req, res) => {
    return res.render("signin");
  },

  signIn: (req, res) => {
    req.flash("success_messages", "您已成功登入");
    res.redirect("/");
  },

  logout: (req, res) => {
    req.flash("success_messages", "您已成功登出");
    req.logout();
    res.redirect("/signin");
  },

  getUser: (req, res) => {
    User.findByPk(req.params.id, {
      include: [{ model: Tweet, Like, Reply, include: [User] }]
    }).then(user => {
      return res.render("users/profile", { profile: user.get() });
    });
  },

  addLike: (req, res) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.id
    }).then(tweet => {
      return res.redirect("back");
    });
  },
  removeLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.id
      }
    }).then(like => {
      like.destroy().then(tweet => {
        return res.redirect("back");
      });
    });
  }
};

module.exports = userController;
