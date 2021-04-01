const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: String,
  maxShifts: Number,
  prefs: mongoose.Mixed
})

const User = mongoose.model('users', userSchema)

module.exports.User = User;