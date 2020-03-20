const db = require("../models");
const Tweet = db.Tweet;
const User = db.User;
const tweetController = {
  // getTweets: (req, res) => {
  //   Tweet.findAll({
  //     nest: true,
  //     raw: true,
  //     order: [["createdAt", "DESC"]],
  //     include: User
  //   })
  // .then(tweets => {
  // return res.render("tweets", {
  // const data = tweets.map(t => ({
  //   ...t,
  //   description: t.description.substring(0, 140)
  // }));
  // });
  // })
  //     .then(tweets => {
  //       User.findAll({
  //         limit: 10,
  //         include: [{ model: User, as: "Followers" }]
  //       }).then(users => {
  //         users = users.map(user => ({
  //           ...user.dataValues,
  //           FollowerCount: user.Followers.length,
  //           isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
  //         }));
  //       });
  //       users = users.sort((a, b) => b.FollowerCount - a.FollowerCount);
  //       return res.render("tweets", {
  //         tweets: tweets.get(),
  //         user: user.get()
  //       });
  //     });
  // }

  getTweets: (req, res) => {
    Tweet.findAll({
      nest: true,
      raw: true,
      include: User
    }).then(tweets => {
      return res.render("tweets", {
        tweets: tweets.map(t => ({
          ...t
        }))
      });
    });
  },
  postTweets: (req, res) => {
    if (
      req.body.description.length > 140 ||
      req.body.description.length === 0
    ) {
      req.flash("error_messages", "please enter 140 words.");
      return res.redirect("back");
    } else {
      return Tweet.create({
        description: req.body.description,
        UserId: req.user.id
      }).then(tweet => {
        req.flash("success_messages", "tweet was successfully created");
        res.redirect("/tweets");
      });
    }
  }
};

module.exports = tweetController;
