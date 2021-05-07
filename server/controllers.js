const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false)
const models = require('../database/models.js')

module.exports.getAll = (req, res) => {
  models.User.find({}, (err, users) => {
    if (err) {
      console.log('error getting user')
      res.status(404).send('error getting user');
    } else {
      res.send(users);
    }
  })
}

module.exports.deleteUser = (req, res) => {
  models.User.deleteOne({ name: req.body.name }, (err) => {
    if (err) {
      console.log('error deleting user')
      res.status(404).send('error deleting user')
    } else {
      console.log('deleted user ', req.body.name)
      res.end();
    }
  })
}

module.exports.getPrefs = (req, res) => {
  models.User.find({ name: req.body.name }, (err, prefs) => {
    if (err) {
      console.log('error getting user')
      res.status(404).send('error getting user');
    } else {
      res.send(prefs);
    }
  })
}

module.exports.postPrefs = (req, res) => {
  // this whole thing seems unnecessary but I wasn't able to get it working any other way I tried
  function write() {
    let user = new models.User({
      name: req.body.name,
      maxShifts: req.body.maxShifts,
      prefs: req.body.prefs
    })
    user.save((err) => {
      if (err) {
        console.log('error saving prefs', err);
        res.end();
      } else {
        console.log('saved prefs');
        res.end();
      }
    })
  }
  models.User.find({ name: req.body.name }, (err, docs) => {
    if (err) {
      console.log('err finding docs', err)
      res.end();
    } else {
      if (docs.length) {
        console.log('updating existing prefs..')
        models.User.deleteOne({ name: req.body.name }, (err) => {
          if (err) {
            console.log('error deleting doc')
            res.end();
          } else {
            write();
          }
        })
      } else {
        console.log('saving new prefs..')
        write();
      }
    }
  })
}

