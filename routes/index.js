const express = require('express')
const router = express.Router()
const helpers = require('../_helpers')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const tweetController = require('../controllers/tweetController.js')
const followshipController = require('../controllers/followshipController.js')
const replyController = require('../controllers/replyController.js')

const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  req.flash('error_messages', '請先登入才能使用')
  res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') {
      return next()
    }
    return res.redirect('/')
  }
  res.redirect('/signin')
}

router.get('/', authenticated, (req, res) => res.redirect('/tweets'))
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweets)
router.get('/tweets/:id/share', authenticated, tweetController.shareTweet)
router.post('/tweets/:id/share', authenticated, tweetController.postTweetShare)

router.post('/tweets/:id/like', authenticated, userController.addLike)
router.post('/tweets/:id/unlike', authenticated, userController.removeLike)

router.get('/tweets/:tweet_id/replies', authenticated, replyController.getReply)
router.post('/tweets/:tweet_id/replies', authenticated, replyController.postReply)

router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/tweets'))
router.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)
router.put('/admin/users/:id', authenticatedAdmin, adminController.putUser)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

router.get('/users/:id/tweets', authenticated, userController.getUser)
router.get('/users/:id/edit', authenticated, userController.editUser)
router.post('/users/:id/edit', authenticated, upload.single('avatar'), userController.putUser)
router.get('/users/:id/likes', authenticated, userController.getLikes)
router.get('/users/:id/followings', authenticated, userController.getFollowings)
router.get('/users/:id/followers', authenticated, userController.getFollowers)

router.post('/followships', authenticated, followshipController.addFollowing)
router.delete('/followships/:followingId', authenticated, followshipController.removeFollowing)

module.exports = router
