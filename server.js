// modules =================================================
var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var app            = express();

// configuration ===========================================

// config files
var db = require('./config/db')

// set our port
var port = process.env.PORT || 8080;

// connect to our mongoDB database
//mongoose.connect(db.url); 

// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json()); 

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public')); 


// app.use(express.static(__dirname + '/public')); 	// set the static files location /public/img will be /img for users
app.use('/node_modules', express.static(__dirname + '/node_modules'));
//app.use(morgan('dev')); 					// log every request to the console
//app.use(bodyParser()); 						// pull information from html in POST
//app.use(methodOverride()); 					// simulate DELETE and PUT

app.listen(port);	
console.log('Simple static server listening on port ' + port); 

exports = module.exports = app;  





