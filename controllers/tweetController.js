const db = require("../models");
const Tweet = db.Tweet;
const User = db.User;
const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({ nest: true, raw: true, include: User }).then(tweets => {
      return res.render("tweets", {
        tweets: tweets.map(t => ({
          ...t,
          description: t.description.substring(0, 140)
        }))
      });
    });
  }
};

module.exports = tweetController;
