// modules =================================================
var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose       = require('mongoose');
var bcrypt         = require('bcrypt-nodejs');
var app            = express();

// configuration ===========================================

// set our port
var port = process.env.PORT || 4001;

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
app.use('/node_modules', express.static(__dirname + '/node_modules'));

// Mongoose stuff ===========================================
// connect to our mongoDB database
mongoose.connect('mongodb://joshuagalindo.com/hammer');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("MongoDb Connected.");
});

// Schemas ===========================================

var Schema = mongoose.Schema;
var userSchema = new Schema({
  name: String,
  email: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: Boolean,
  imageuri: String
});

var User = mongoose.model('User', userSchema);

var postSchema = new Schema({
  username: { type: String, required: true },
  body: { type: String, required: true },
  createdOn : Date
});

var Post = mongoose.model('Post', postSchema);

// API Endpoints ===========================================
// SignUp, Sign In/Out ==============================
app.post('/signup', function(req, res) {
    
    try
    {
        // Check if password is good before checking the database
        if(req.body.password.length >= 6) {
            // Check if user already exists
            User.findOne({username: req.body.username}, 'name', function (err, user) {
                
                if(user === null)
                {
                    var new_user = new User ({ 
                        name: req.body.name,
                        email:  req.body.email,
                        username: req.body.username,
                        password: encryptPassword(req.body.password),
                        admin: false,
                        imageuri: req.body.imageUri
                    });
                    
                    new_user.save();
                    
                    var response = {
                        status  : 200,
                        success : 'Successfully Signed Up as: ' + req.body.name,
                        token   : encryptPassword(new_user.username + new_user.password)
                    }
                    res.end(JSON.stringify(response));
                }
                else 
                {
                    var response = {
                        status  : 500,
                        error   : 'A user already exists with this username.'
                    }
                    res.end(JSON.stringify(response));
                }
            });
        }
        else {
            var response = {
                status  : 500,
                error   : 'Password must be at least 6 characters.'
            }
            res.end(JSON.stringify(response));
        }
        
    }
    catch(err)
    {
       console.log(err);
       var response = {
            status  : 500,
            error   : 'Fatal error during Sign Up.'
        }
        res.end(JSON.stringify(response));
    }
});

app.post('/signin', function(req, res) {
    
    try
    {
        // Check if user exists in DB
        User.findOne({username: req.body.username}, 'name password', function (err, user) {
            if(user === null)
            {
                var response = {
                    status  : 500,
                    error : 'Username or password combination not found.'
                }
                res.end(JSON.stringify(response));
            }
            else {
                var isMatch = bcrypt.compareSync(req.body.password, user.password);
                if(err || !isMatch)
                {   
                    var response = {
                        status  : 501,
                        error : 'Username or password combination was incorrect.'
                    }
                    res.end(JSON.stringify(response));
                }
                else {
                    var response = {
                        status  : 200,
                        success : 'Successfully Signed In as: ' + user.name,
                        token   : encryptPassword(user.username + user.password)
                    }
                    res.end(JSON.stringify(response));
                }
            }
        });
    }
    catch(err)
    {
        console.log(err);
        var response = {
            status  : 500,
            error : 'Fatal error during Sign In.'
        }
        
        res.end(JSON.stringify(response));
    }
});

// Posts =======================
app.get('/allPosts', function(req, res) {
    Post.find({}, function(err, posts) {
         res.send(
             posts.sort(function(a, b) { return a.createdOn < b.createdOn })
        ); 
    });
});

app.post('/createPost', function(req, res) {
    try
    {
        // Check if user exists in DB
        User.findOne({username: req.body.username}, 'username', function (err, user) {
            if(user === null)
            {
                var response = {
                    status  : 500,
                    error : 'User not found, please sign in.'
                }
                res.end(JSON.stringify(response));
            }
            else 
            {
                // Create and save new post
                var new_post = new Post ({
                    username: req.body.username,
                    body: req.body.body,
                    createdOn: new Date()
                });
                
                new_post.save();

                var response = {
                    status  : 200,
                    success : 'Post created successfully'
                }
                res.end(JSON.stringify(response));
            }
        });
    }
    catch(err)
    {
        console.log(err);
        var response = {
            status  : 500,
            error : 'Fatal error during Create Post.'
        }
        
        res.end(JSON.stringify(response));
    }
});

// Server Start ===========================================

app.listen(port);
console.log("Server is now listening on port: " + port);

exports = module.exports = app;  

encryptPassword = function(password) {
    // Generate a salt
    var salt = bcrypt.genSaltSync(10);
    // Hash the password with the salt
    return bcrypt.hashSync(password, salt);
}