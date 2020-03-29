const db = require('../models')
const helpers = require('../_helpers')
const Followship = db.Followship

const followshipController = {
  addFollowing: (req, res) => {
    if (helpers.getUser(req).id === Number(req.body.id)) {
      return res.send('can not follow self')
    }
    Followship.create({
      followerId: helpers.getUser(req).id,
      followingId: Number(req.body.id)
    }).then(followship => {
      return res.redirect('back')
    })
  },

  removeFollowing: (req, res) => {
    Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.followingId
      }
    }).then(followship => {
      console.log(followship)
      followship.destroy().then(followship => {
        return res.redirect('back')
      })
    })
  }
}

module.exports = followshipController