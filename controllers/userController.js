const bcrypt = require('bcryptjs')
const db = require('../models')
const helpers = require('../_helpers')
const User = db.User
const Tweet = db.Tweet

const Sequelize = require('sequelize')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '請輸入相同密碼')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '此信箱已註冊')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
          }).then(user => {
            req.flash('success_messages', '註冊完成，請登入才能使用')
            return res.redirect('/signin')
          })
        }
      })
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '您已成功登入')
    res.redirect('/')
  },

  logout: (req, res) => {
    req.flash('success_messages', '您已成功登出')
    req.logout()
    res.redirect('/signin')
  },

  getUser: (req, res) => {
    User.findByPk(req.params.id, {
      include: [
        { model: Tweet, include: [User] },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ],
      attributes: [
        'id', 'email', 'name', 'avatar', 'introduction',
        // 推播數量
        [Sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'), 'TweetsCount'],
        // 推播被 like 的數量
        [Sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE TweetId in (SELECT id FROM Tweets where UserId = User.id))'), 'LikesCount']
      ],
    }).then(user => {
      const FollowingsCount = user.Followings.length
      const FollowersCount = user.Followers.length
      const isFollowed = req.user.Followings.map(d => d.id).includes(user.id)
      return res.render("users/profile", { profile: user.get(), FollowingsCount, FollowersCount, isFollowed })
    })
  }
}

module.exports = userController