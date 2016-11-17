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
  imageuri: String,
  following: [{ type: String }]
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
                        imageuri: req.body.imageUri,
                        following: []
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
       console.error(err);
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
                var isMatch = false;
                if(req.body.password !== undefined)
                {
                    isMatch = bcrypt.compareSync(req.body.password, user.password);
                }

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
        console.error(err);
        var response = {
            status  : 500,
            error : 'Fatal error during Sign In.'
        }
        
        res.end(JSON.stringify(response));
    }
});

// Posts =======================
app.get('/allPosts', function(req, res) {
    User.findOne({username: req.query.username}, 'following', function (err, user) {
        if(user !== null)
        {
            // Include self posts in the filter, do not save yourself into following
            user.following.push(req.query.username);
            Post.find({username: { $in: user.following } }, function(err, posts) {
                res.send(
                    posts.sort(function(a, b) { return a.createdOn < b.createdOn })
                );
            });
        }
        else {
            Post.find({}, function(err, posts) {
                res.send(
                    posts.sort(function(a, b) { return a.createdOn < b.createdOn })
                );
            });
        }
    });
});

app.get('/userPosts', function(req, res) {
    Post.find({ username: req.query.username }, function(err, posts) {
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
        console.error(err);
        var response = {
            status  : 500,
            error : 'Fatal error during Create Post.'
        }
        
        res.end(JSON.stringify(response));
    }
});

// Profile ==============================================
app.post('/userInfo', function(req, res) {
    if(req.body.userOwnsPage && req.body.userOwnsPage == "true")
    {
        User.findOne({username: req.body.username}, 'username email name imageuri', function (err, user) {
        
            if(user === null)
            {
                var response = {
                    status  : 500,
                    error : 'User not found, please sign in.'
                }
                res.end(JSON.stringify(response));
                return;
            }

            var isMatch = true; // false by default
            // if(req.body.token !== null)
            // {
            //     isMatch = bcrypt.compareSync(user.username + user.password, req.body.token);
            // }

            if(isMatch)
            {
                var userInfo = { 
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    imageuri: user.imageUri
                };

                res.send(JSON.stringify(userInfo));
            }
            else
            {
                var response = {
                        status  : 501,
                        error : 'User token was incorrect please signin again.'
                }
                res.end(JSON.stringify(response));
            }
        });
    }
    // User is guest, hide personal data
    else {
        User.findOne({username: req.body.username}, 'username name imageuri', function (err, user) {
        
            if(user === null)
            {
                var response = {
                    status  : 500,
                    error : 'Requested user not found.'
                }
                res.end(JSON.stringify(response));
            }
            else {
                var userInfo = { 
                    name: user.name,
                    username: user.username,
                    imageuri: user.imageUri
                };
                res.send(JSON.stringify(userInfo));
            }
        });            
    }
});

// Followers =============================================
app.get('/following', function(req, res) {
    User.findOne({ username: req.query.username }, 'following', function (err, current_user) {
        if(current_user !== null)
        {
            // Return all users in following
            User.find({username: { $in: current_user.following } }, 'name username imageuri', function(err, users){
                res.send(JSON.stringify(users));
            });
        }
        else {
            // Empty array
            res.send("[]");
        }
    });
});

// Search =================================================
app.get('/search', function(req, res) {
    var query = new RegExp(req.query.query, "i");
    User.find({'$or': [{ name: query }, { username: query }]}, 'username name imageuri', function (err, users) {
        if(users !== null)
        {
            res.send(JSON.stringify(users));
        }
        else {
            // Empty array
            res.send("[]");
        }
    });
});

app.get('/users', function(req, res) {
    User.find({}, 'name username imageuri', function (err, users) {
        res.send(JSON.stringify(users));
    });
});

app.post('/updateFollower', function(req, res) {
    User.findOne({username: req.body.username}, 'following', function (err, user) {
        if(user === null)
        {
            var response = {
                status  : 500,
                error : 'User not found.'
            }
            res.end(JSON.stringify(response));
            return;
        }
        else {
            if(req.body.updatedFollow) {
                try {
                   if(user.following === undefined) {             
                       user.following = [];
                       user.following.push(req.body.updatedFollow);
                       user.save(function(err, user) {
                            if (err) {
                                console.error(err);
                                res.send(400, 'Bad Request');
                            }
                        });

                        var response = {
                            status  : 200,
                            success : 'Successfully updated user\'s follows.'
                        };
                        res.end(JSON.stringify(response));
                   }
                   else {
                    if(user.following.indexOf(req.body.updatedFollow) != -1) { // Unfollow
                        user.following = user.following.filter(follows => follows !== req.body.updatedFollow);
                        user.save(function(err, user) {
                            if (err) {
                                console.error(err);
                                res.send(400, 'Bad Request');
                            }
                        });

                        var response = {
                            status  : 200,
                            success : 'Successfully updated user\'s follows.'
                        };
                        res.end(JSON.stringify(response));
                    }
                    else { // Follow
                        user.following.push(req.body.updatedFollow);
                        user.save(function(err, user) {
                            if (err) {
                                console.error(err);
                                res.send(400, 'Bad Request');
                            }
                        });

                        var response = {
                            status  : 200,
                            success : 'Successfully updated user\'s follows.'
                        };
                        res.end(JSON.stringify(response));
                    }
                   }
                }
                catch(exception) {
                     console.error(exception.stack);
                     var response = {
                        status  : 500,
                        error : 'Failed to update user\'s follows.'
                    };
                    res.end(JSON.stringify(response));
                }
            }
             var response = {
                status  : 500,
                error : 'Failed to update user\'s follows.'
            };
            res.end(JSON.stringify(response));
        }
    });
});

// Server Start ==========================================

app.listen(port);
console.log("Server is now listening on port: " + port);

exports = module.exports = app;  

encryptPassword = function(password) {
    // Generate a salt
    var salt = bcrypt.genSaltSync(10);
    // Hash the password with the salt
    return bcrypt.hashSync(password, salt);
}