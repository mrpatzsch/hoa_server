var mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/associations');

var violationSchema = new mongoose.Schema({
  violationInfo: String,
  violationThumb: String,
  violationDate: { type: Date, default: Date.now },
  violationOutstanding: { type: Boolean, default: true }
});

var houseSchema = new mongoose.Schema({
  address: Number,
  street: String,
  violations: [violationSchema]
});

var associationSchema = new mongoose.Schema({
  name: String,
  houses: [houseSchema]
});

module.exports = Association = mongoose.model('Association', associationSchema);