var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Promise = require('bluebird');

db.userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  var pw = this.password;
  bcrypt.compare(attemptedPassword, pw, function(err, isMatch) {
    callback(isMatch);
  });
};

db.userSchema.methods.hashPassword = function() {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      this.save(function(err) {
        if (err) {
          throw err;
        }
        // return this.password;
      });
    });
};

// db.userSchema.pre('save', function(next) {
//   this.hashPassword();

//   next();
// });

var User = mongoose.model('User', db.userSchema);

// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function() {
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function() {
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });

module.exports = User;
