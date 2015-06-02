var REPL = require("repl");
var db = require("./models");

var repl = REPL.start("House > ");
repl.context.db = db;

repl.on("exit", function() {
  console.log("Goodbye");
  process.exit();
});
