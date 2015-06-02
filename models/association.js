var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/associations");

var associationSchema = new mongoose.Schema({
  name: {
  	type: String,
  	default: ""
  },
  houses: [houseSchema]
});

var Association = mongoose.model("Association", associationSchema);

module.exports.Association = Association;
