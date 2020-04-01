const db = require("../models");
const Reply = db.Reply;
const User = db.User;
const Tweet = db.Tweet;
const Like = db.Like;
const helpers = require("../_helpers");
const replyController = {
  getReply: (req, res) => {
    Tweet.findByPk(req.params.tweet_id, {
      include: [User, Like, { model: Reply, include: [User] }]
    }).then(tweet => {
      User.findByPk(tweet.UserId, {
        include: [Like, Tweet]
      }).then(user => {
        const data = {
          replies: tweet.Replies,
          tweetLikedCount: tweet.Likes.length,
          replyCount: tweet.Replies.length,
          isLiked: tweet.Likes.map(d => d.UserId).includes(
            helpers.getUser(req).id
          ),
          tweet: tweet
        };
        return res.render("replies", data);
      });
    });
  },
  postReply: (req, res) => {
    if (req.body.comment.length === 0) {
      req.flash("error_messages", "please enter replies.");
      return res.redirect('back')
    }
    return Reply.create({
      comment: req.body.comment,
      TweetId: req.params.tweet_id,
      UserId: helpers.getUser(req).id
    }).then(reply => {
      res.redirect("back");
    });
  }
};
module.exports = replyController;
