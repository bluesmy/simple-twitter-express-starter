const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply

const adminController = {

  getTweets: (req, res) => {
    // 看見站內所有的推播
    Tweet.findAll({
      include: [User, Reply],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        tweets = tweets.map(tweet => ({
          ...tweet.dataValues,
          description: tweet.dataValues.description.substring(0, 50),
          // 可以直接在清單上快覽推播回覆內容前 50 個字
          Replies: tweet.dataValues.Replies.map(reply => ({
            ...reply.dataValues,
            comment: reply.dataValues.comment.substring(0, 50),
          }))
        }))
        return res.render('admin/tweets', { tweets })
      })
  },
}

module.exports = adminController