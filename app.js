var express = require('express'),
    bodyParser = require('body-parser'),
    db = require('./models'),
    users = require('./models/user'),
    session = require("express-session"),
    jwt = require('express-jwt'),
    app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));


// app.get('/protected',
//   jwt({secret: 'shhhhhhared-secret'}),
//   function(req, res) {
//     if (!req.user.admin) return res.send(401);
//     res.send(200);
//   });

// app.use(jwt({secret: 'shhhhhhared-secret'}).unless({path: ['/token']}));

// app.use(jwt({
//   secret: 'hello world !',
//   credentialsRequired: false,
//   getToken: function fromHeaderOrQuerystring(req) {
//     if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
//       return req.headers.authorization.split(' ')[1];
//     } else if (req.query && req.query.token) {
//       return req.query.token;
//     }
//     return null;
//   }
// }));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://hoa-front.herokuapp.com');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/', function(req, res) {
  res.send("IT'S WORKING");
});

app.get('/users', function(req, res) {
  users.find({}, function(err, user) {
    res.send(user);
  });
});

app.post("/user/new", function(req, res) {
  var user = req.body;
  users.createSecure(user.username, user.email, user.passwordDigest, user.companyName, user.address, user.address2, user.city, user.state, user.zipcode, user.tel, function(err, user) {
    if(err) res.send(err);
    console.log("Success!", user);
    res.send(user);
  });
});

app.post("/login", function(req, res) {
  var user = req.body;
  users.authenticate(user.email, user.password,
    function(err, user) {
      if(err) return res.send(err);
      res.send(user);
    });
});


//Get Associations List 
app.get("/associations", function(req, res) {
  Association.find({},
    function(err, associations) {
      res.send(associations);
    });
});

app.get('/user/associations', function(req, res) {
  var user = req.body;
  users.find({name: user.name}, function(err, user) {
    res.send(user.associations);
  })
})

//Get Specific Association with "name"
app.get("/associations/:name", function(req, res) {
  var id = req.params.id;
  var name = req.params.name;
  Association.findOne({name: name}, function(err, association) {
    res.send(association);
  });
});

//Get Specific House with association name and house ID 
app.get("/associations/:name/house/:id", function(req, res) {
  var name = req.params.name;
  var id = req.params.id;
  Association.findOne({name: name}, function(err, association) {
    var houseId = association.houses.id(id);
    res.send(houseId);
  });
});

//Get Specific Violation with association name, house ID, and violation ID
app.get("/associations/:name/house/:houseId/violation/:violationId", function(req, res) {
  var name = req.params.name;
  var id = req.params.houseId
  var violation = req.params.violationId;
  Association.findOne({name: name}, function(err, association) {
    var houseId = association.houses.id(id);
    var violationId = association.houses.id(id).violations.id(violation);
    res.send(violationId);
  });
});

// app.post("/associations/:name/violation/new", function(req, res) {
//   var name = req.params.name;
//   var add = req.body.address;
//   var st = req.body.street;
//   Association.findOne({name: name}, function(err, association) {
//     association.houses.findOne({address: add, street: st}, function(err, house) {
//       console.log(house);
//       house.violations.push({violationInfo: info});
//         association.save(function(err) {
//           if(err) return res.send(err) 
//           console.log("Violation Added");
//           res.send(association);
//       });
//     });
//   });
// });

app.post("/associations/new", function(req, res) {
  var newName = req.body.name;
  Association.create({name: newName});
})

//Post new House to association with Name 
app.post("/associations/:name", function(req, res) {
  var name = req.params.name;
  var add = req.body.address;
  var st = req.body.street;
  console.log(add, st);
  Association.findOne({name: name}, function(err, association) {
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


app.listen(process.env.MONGOLAB_URI || 3000, function() {
  console.log("Server running");
});
