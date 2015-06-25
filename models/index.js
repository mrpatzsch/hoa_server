// module.exports.User = require('./user');
var mongoose = require("mongoose");
mongoose.connect(process.env.MONGOLAB_URI)
module.exports.House = require('./house');
module.exports.Association = require('./association');
module.exports.User = require('./user');


