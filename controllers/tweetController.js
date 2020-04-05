const db = require("../models");
const Tweet = db.Tweet;
const User = db.User;
const Reply = db.Reply;
const helpers = require("../_helpers");
const tweetController = {
  getTweets: (req, res) => {
    return Tweet.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        User,
        { model: User, as: "LikedUsers" },
        { model: Reply, include: [User] }
      ]
    }).then(tweets => {
      const data = tweets.map(tweet => ({
        ...tweet.dataValues,
        isLiked: tweet.LikedUsers.map(d => d.id).includes(
          helpers.getUser(req).id
        ),
        reply: tweet.Replies.length
      }));
      User.findAll({
        limit: 10,
        include: [Tweet, { model: User, as: "Followers" }]
      }).then(users => {
        users = users.map(user => ({
          ...user.dataValues,
          FollowerCount: user.Followers.length,
          isFollowed: helpers
            .getUser(req)
            .Followings.map(d => d.id)
            .includes(user.id)
        }));
        users = users.sort((a, b) => b.FollowerCount - a.FollowerCount);
        return res.render("tweets", {
          users: users,
          tweets: data
        });
      });
    });
  },

  postTweets: (req, res) => {
    if (
      req.body.description.length > 140 ||
      req.body.description.length === 0
    ) {
      req.flash("error_messages", "please enter 1 to 140 words.");
      return res.redirect("/tweets");
    } else {
      return Tweet.create({
        description: req.body.description,
        UserId: helpers.getUser(req).id
      }).then(tweet => {
        req.flash("success_messages", "tweet was successfully created");
        res.redirect("/tweets");
      });
    }
  },

  shareTweet: (req, res) => {
    return Tweet.findByPk(req.params.id, { include: User }).then(tweet => {
      return res.render('sharetweet', { tweet: tweet.get() })
    })
  },
  postTweetShare: (req, res) => {
    if (
      req.body.description.length > 140 ||
      req.body.description.length === 0
    ) {
      req.flash('error_messages', 'please enter 1 to 140 words.')
      return res.redirect('back')
    } else {
      return Tweet.create({
        description: req.body.description,
        UserId: helpers.getUser(req).id
      }).then(tweet => {
        req.flash('success_messages', 'tweet was successfully created')
        res.redirect('/tweets')
      })
    }
  }
};

module.exports = tweetController;
