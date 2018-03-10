// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var	http 	 = require( 'http' );
var	connect  = require('connect');

// For firebase connection
// =================================================
var firebase = require("firebase");
var config = require("./config/firebase.conf.json");
firebase.initializeApp(config);
//=====================================================/
// Sets up the Express App
// =============================================================
var app = express();
var server = http.createServer( app );
var socket 	 = require( 'socket.io' );
var socketcommunication=require('./lib/sockets.js')(socket, server,firebase);

var PORT = 8080;

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Static directory
app.use(express.static("public"));

// Set Handlebars.
/*var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");*/

//Setting Routes

require('./config/routes.js')(app,socketcommunication.getwebsocket(),firebase);

// Routes
// =============================================================
/*const postController = require("./controllers/post-controller.js");
const authorController = require("./controllers/author-controller.js");
const viewController = require("./controllers/view-controller.js");

app.use(postController);
app.use(authorController);
app.use(viewController);*/

// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync().then(function() {
  server.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});
