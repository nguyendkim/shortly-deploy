var db = require('../config');
var mongoose = require('mongoose');
var crypto = require('crypto');

db.urlSchema.methods.generateCode = function() {
  // crypto on base url
  // set this.code = to crypted url
  // return this.code
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);

  return this.code;
};

db.urlSchema.pre('save', function(next) {
  this.generateCode();

  next();
});

var Link = mongoose.model('Link', db.urlSchema);
// var Link = db.Link.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function() {
//     this.on('creating', function(model, attrs, options) {
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });

module.exports = Link;
