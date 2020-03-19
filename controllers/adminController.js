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

  deleteTweet: (req, res) => {
    // 刪除其他使用者的推文
    Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) {
          req.flash('error_messages', 'Tweet not found!')
          return res.redirect('back')
        }
        if (helpers.getUser(req).role !== 'admin') {
          req.flash('error_messages', '您無此權限，請重新登入！')
          return res.redirect('/signin')
        }
        tweet.destroy()
          .then(tweet => {
            // 刪除該貼文回覆
            Reply.findAll({ where: { TweetId: req.params.id } })
              .then(replies => {
                replies.forEach(reply => reply.destroy())
              })
            req.flash('success_messages', '該Tweet已成功刪除')
            return res.redirect('/admin/tweets')
          })
      })
  },
}

module.exports = adminController