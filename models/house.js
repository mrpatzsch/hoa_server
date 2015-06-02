var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/houses");

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

var House = mongoose.model("House", houseSchema);

module.exports.House = House;
