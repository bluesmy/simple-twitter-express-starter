const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const helpers = require('../_helpers')
const tweetController = {
  getTweets: (req, res) => {
    return Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [User]
    }).then(tweets => {
      User.findAll({
        limit: 10,
        include: [Tweet, { model: User, as: 'Followers' }]
      }).then(users => {
        users = users.map(user => ({
          ...user.dataValues,
          FollowerCount: user.Followers.length,
          isFollowed: req.user.Followings.map(d => d.id).includes(user.id),
          introduction: user.introduction.substring(0, 50)
        }))
        users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
        return res.render('tweets', {
          users: users,
          tweets: tweets
        })
      })
    })
  },

  // getTweets: (req, res) => {
  //   Tweet.findAll({
  //     nest: true,
  //     raw: true,
  //     include: User
  //   }).then(tweets => {
  //     return res.render("tweets", {
  //       tweets: tweets.map(t => ({
  //         ...t
  //       }))
  //     });
  //   });
  // },
  postTweets: (req, res) => {
    if (
      req.body.description.length > 140 ||
      req.body.description.length === 0
    ) {
      req.flash('error_messages', 'please enter 1 to 140 words.')
      return res.redirect('/tweets')
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
}

module.exports = tweetController
