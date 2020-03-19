const helpers = require('../_helpers');

const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

const Sequelize = require('sequelize')

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

  getUsers: (req, res) => {
    // 看見站內所有的使用者
    User.findAll({
      include: [
        { model: Tweet, include: [Like] },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' },
      ],
      attributes: [
        'id', 'email', 'name', 'role',
        // 推播數量
        [Sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'), 'TweetsCount'],
        // 推播被 like 的數量
        [Sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE TweetId in (SELECT id FROM Tweets where UserId = User.id))'), 'LikesCount']
      ],
      // 清單預設按推播文數排序
      order: [[Sequelize.literal("TweetsCount DESC")]],
    })
      .then(users => {
        // 關注人數、跟隨者人數
        users = users.map(user => ({
          ...user.dataValues,
          // TweetsCount: user.dataValues.TweetsCount,
          // LikesCount: user.dataValues.LikesCount,
          FollowingsCount: user.Followings.length,
          FollowersCount: user.Followers.length
        }))
        return res.render('admin/users', { users })
      })
  },

  putUser: (req, res) => {
    // 修改使用者為admin/user
    User.findByPk(req.params.id)
      .then(user => {
        if (user.role === 'admin') {
          user.update({
            role: 'user'
          })
        }
        else {
          user.update({
            role: 'admin'
          })
        }
      })
      .then(user => {
        req.flash('success_messages', '使用者身分已成功更新')
        res.redirect('/admin/users')
      })
  }
}

module.exports = adminController