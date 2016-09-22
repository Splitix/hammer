// modules =================================================
var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose       = require('mongoose');
var app            = express();
var router         = express.Router();

// configuration ===========================================

// config files
var db = require('./config/db')

// set our port
var port = process.env.PORT || 4001;

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
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public')); 
// Mongoose stuff

// connect to our mongoDB database
mongoose.connect('mongodb://localhost/hammer'); 
// grab the things we need
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
  name: String,
  email: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: Boolean,
  imageuri: String
});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;

app.post('/signup', function(req, res, next) {
    var new_user = new User ({ 
    name: req.body.name,
    email :  req.body.email,
    username: req.body.username,
    password: req.body.password,
    admin: false,
    imageuri: req.body.imageUri
    });

    try
    {
        new_user.save();
    }
    catch(error)
    {
        return res.json("Failed to create new User.", error);
    }
    
    return res.json("Successfully created new User.");
    //res.redirect('/');
});

app.get('/users', function(req, res, next) {
    res.send(JSON.stringify(User.find({})));
});
    
app.listen(port);

console.log("Server is now listening on port: " + port);

module.exports = router;
exports = module.exports = app;  
