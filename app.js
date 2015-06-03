var express = require('express'),
    bodyParser = require('body-parser'),
    db = require('./models'),
    session = require("express-session"),
    app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));



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

app.get("/associations/:name", function(req, res) {
  var id = req.params.id;
  var name = req.params.name;
  db.Association.find({name: name}, function(err, association) {
    res.send(association);
  });
});

app.post("/associations/:name", function(req, res) {
  var name = req.params.name;
  var add = req.body.address;
  var st = req.body.street;
  console.log(add, st);
  db.Association.find({name: name}, function(err, association) {
    association[0].houses.push({address: add, street: st});
    if(association[0].houses[houses.length -1].isNew) {
        association[0].save(function(err) {
          if (err) return handleError(err)
            console.log("Success!");
        });
      };
  });
});

// greentree[0].houses.push({address: 4281, street: "Skylark Ave"});
//var subdoc = greentree[0].houses[1];
//subdoc.isNew;
//greentree[0].save(function(err) {
// if(err) return handleError(err)
// console.log("Success!");
//});
// app.post("/associations", function(req, res) {
//   var add = req.body.address;
//   var st = req.body.street;
//   var association = req.body.association
//   db.Association.find({name: association}, function(err, ass) {
//     ass.push({address: add, street: st}, function(newAdd) {
//       ass.save(function(err) {
//         if(err) return handleError(err)
//         console.log("Success!");
//      });
//     });
//   });
// });


app.listen(3000, function() {
  console.log("Server running");
});
