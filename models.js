var mongoose = require("mongoose");
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

mongoose.connect("mongodb://localhost/associations");

var houseSchema = new mongoose.Schema({
  address: {
    type: Number,
    default: ""
           },
  street: {
    type: String,
            default: ""
          },
  violations: {
    type: Number,
                default: 0
              }
});

var associationSchema = new mongoose.Schema({
  name: {
    type: String,
    default: ""
  },
  houses: [houseSchema]
});

var userSchema = new mongoose.Schema({
  username: String,
  email: String,
  passwordDigest: String
});

userSchema.statics.createSecure = function(username, email, password, cb) {
  var that = this;
  bcrypt.genSalt(function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      console.log(hash);
      that.create({
        username: username,
        email: email,
        passwordDigest: hash
      }, cb)
    });
  })
};

userSchema.statics.encryptPassword = function(password) {
  var hash = bcrypt.hashSync(password, salt);
  return hash;
};

userSchema.statics.authenticate = function(email, password, cb) {
  this.find({
    email: email
  },
  function(err, user) {
    if (user === null) {
      throw new Error("Username does not exist");
    } else if(user.checkPassword(password)) {
      cb(null, user);
    }
  })
}

userSchema.methods.checkPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordDigest);
};

var User = mongoose.model("User", userSchema);

module.exports.User = User;

var Association = mongoose.model("Association", associationSchema);

module.exports.Association = Association;
