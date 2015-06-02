var mongoose = require("mongoose");

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


var Association = mongoose.model("Association", associationSchema);

module.exports.Association = Association;
