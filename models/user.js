var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
var mongoose = require('mongoose');

mongoose.createConnection(process.env.MONGOLAB_URI) || mongoose.connect('mongodb://localhost/g');


var violationSchema = new mongoose.Schema({
  violationInfo: String,
  violationThumb: String,
  violationDate: { type: Date, default: Date.now },
  violationOutstanding: { type: Boolean, default: true }
});

var userHouseSchema = new mongoose.Schema({
  address: Number,
  street: String,
  violations: [violationSchema]
});

var userAssociationSchema = new mongoose.Schema({
  name: String,
  houses: [userHouseSchema]
});

var userSchema = new mongoose.Schema({
  username: String,
  email: String,
  passwordDigest: String,
  companyName: String,
  address: String,
  address2: String,
  city: String,
  state: String,
  zipcode: String,
  tel: String,
  associations: [userAssociationSchema]
});

userSchema.statics.createSecure = function(username, email, password, companyName, address, address2, city, state, zipcode, tel, associations, cb) {
  var that = this;
  bcrypt.genSalt(function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      console.log(hash);
      that.create({
        username: username,
        email: email,
        companyName: companyName,
        address: address,
        address2: address2,
        city: city,
        state: state,
        zipcode: zipcode,
        tel: tel,
        associations: associations,
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
  this.findOne({
    email: email
  },
  function(err, user) {
    if (user === null) {
      return Error("Username does not exist");
    } else if(bcrypt.compareSync(password, user.passwordDigest)) {
      cb(null, user);
    } else {
      cb(null);
    }
  })
}

userSchema.method.compare = function(password) {
  return bcrypt.compareSync(password, this.passwordDigest);
};

var User = mongoose.model("User", userSchema);

module.exports = User;

