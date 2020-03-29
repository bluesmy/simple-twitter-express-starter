const bcrypt = require('bcryptjs')
const db = require('../models')
const helpers = require('../_helpers')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like

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
        Like
      ],
      order: [[{ model: Tweet }, 'createdAt', 'DESC']]
    }).then(user => {
      const TweetsCount = user.Tweets.length
      const FollowingsCount = user.Followings.length
      const FollowersCount = user.Followers.length
      const LikesCount = user.Likes.length
      const isFollowed = helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
      return res.render('users/profile', { profile: user.get(), TweetsCount, FollowingsCount, FollowersCount, LikesCount, isFollowed })
    })
  },

  getLikes: (req, res) => {
    User.findByPk(req.params.id, {
      include: [
        { model: Tweet, include: [User] },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        Like,
        { model: Tweet, as: 'LikedTweets', include: [User] },
      ],
      // 依照Like順序排列
      order: [[{ model: Tweet, as: 'LikedTweets' }, Like, 'updatedAt', 'DESC']]
    }).then(user => {
      console.log(user.LikedTweets)
      const TweetsCount = user.Tweets.length
      const FollowingsCount = user.Followings.length
      const FollowersCount = user.Followers.length
      const LikesCount = user.Likes.length
      const isFollowed = helpers.getUser(req).Followings.map(d => d.id).includes(user.id)

      return res.render('users/likes', { profile: user.get(), TweetsCount, FollowingsCount, FollowersCount, LikesCount, isFollowed })
    })
  }
}

module.exports = userController