const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let UserSchema = new mongoose.Schema({
  roomCode: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  passcode: {
    type: String,
    required: true,
    min:4
  }
});

//authenticate input against database
UserSchema.statics.authenticate = function (roomCode, passcode, callback) {
  User.findOne({ roomCode: roomCode })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(passcode, user.passcode, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

//hashing a passcode before saving it to the database
UserSchema.pre('save', function (next) {
  let user = this;
  bcrypt.hash(user.passcode, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.passcode = hash;
    next();
  })
});


let User = mongoose.model('User', UserSchema);
module.exports = User;

