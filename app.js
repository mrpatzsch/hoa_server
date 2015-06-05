var express = require('express'),
    bodyParser = require('body-parser'),
    db = require('./models'),
    session = require("express-session"),
    jwt = require('express-jwt'),
    app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));


app.get('/protected',
  jwt({secret: 'shhhhhhared-secret'}),
  function(req, res) {
    if (!req.user.admin) return res.send(401);
    res.send(200);
  });

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/signup", function(req, res) {
});

app.get('/users', function(req, res) {
  db.User.find({}, function(err, user) {
    res.send(user);
  });
});

app.post("/user/new", function(req, res) {
  var user = req.body;
  console.log(user);
  db.User.createSecure(user.email, user.password, function(err, user) {
    console.log("Success!", user);
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
  db.Association.findOne({name: name}, function(err, association) {
    res.send(association);
  });
});

app.put("/associations/:name/violation", function(req, res) {
  db.Association.findOne({name: name}, function(err, association) {
    association.violations += 1;
    association.save(function(err) {
      if(err) return res.send(err) 
        console.log("Violation Added");
        res.send(association);
    });
  });
});

app.post("/associations/:name", function(req, res) {
  var name = req.params.name;
  var add = req.body.address;
  var st = req.body.street;
  console.log(add, st);
  db.Association.findOne({name: name}, function(err, association) {
    association.houses.push({address: add, street: st});
      association.save(function(err) {
        if (err) return res.send(err)
        console.log("Success!");
        res.send(association);
      });
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
