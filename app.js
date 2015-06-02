var express = require('express'),
    bodyParser = require('body-parser'),
    db = require('./models'),
    session = require("express-session"),
    app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(session({
  secret: 'super secret',
  resave: false,
  saveUnitialized: true
}))

app.get("/signup", function(req, res) {
});

app.post("/users", function(req, res) {
  var user = req.body.user;

  db.User.createSecure(user.username, user.email, user.password, function() {
  });
});

app.post("/login", function(req, res) {
  var user = req.body.user;

  db.User.authenticate(user.email, user.password,
    function(err, user) {
      res.send(user);
    });
});

app.get("/houses", function(req, res) {
  db.House.find({},
    function(err, houses) {
      res.send(houses);
    });
});

app.get("/associations", function(req, res) {
  db.Association.find({},
    function(err, associations) {
      res.send(associations);
    });
});


app.listen(3000, function() {
  console.log("Server running");
});
