angular.module('hammer.controllers', [])

.controller('DashCtrl', function($scope, $state, $http, $rootScope, UserService, PostService, $location){
    $scope.searchForm = {};
    
    $scope.placeholderImage = "http://img15.deviantart.net/7a8c/i/2012/226/7/8/christmas_kittens_by_mskrissi87-d5b53bq.jpg";
    
    // Check if user is signed in    
    $rootScope.IsUserSignedIn = UserService.IsUserSignedIn();

    $scope.getAllPosts = function() {
        $scope.loading = true;
        PostService.GetAllPosts(UserService.GetCurrentUserName())
        .then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            console.log("Successfully retrieved posts.");
            $scope.posts = response.data;
            $scope.loading = false;
            if(JSON.stringify($scope.posts) === JSON.stringify({})){
                // Some mockup posts
                $scope.posts = [
                {body: "Here are some sample posts because there weren't any in the database.", name: "Blake Bordovsky", imageUri : "http://placekitten.com/100/200/"},
                {body: "We'll throw some old gray clouds in here just sneaking around and having fun. Tree trunks grow however makes them happy. That's what painting is all about. It should make you feel good when you paint. Just pretend you are a whisper floating across a mountain. We need dark in order to show light. With something so strong, a little bit can go a long way.",
                name: "Bob Ross", imageUri : "http://www.bobrosslipsum.com/images/bob-ross-cutout.png"},
                {body: "Hammer is super cool.", name: "Joshua Galindo", imageUri : "http://placekitten.com/201/201/"},
                {body: "Testing out this user post.", name: "Blake Bordovsky", imageUri : "http://placekitten.com/201/201/"},
                {body: "The chicken noodles in Harris Hall were satisfactory.", name: "Jason Flinn", imageUri : "http://placekitten.com/201/201/"},
                {body: "San Marcos is flooding super bad right now!", name: "Blake Bordovsky", imageUri : "http://placekitten.com/201/201/"},
                {body: "Project Hammer is using the MEAN stack.", name: "Joshua Galindo", imageUri : "http://placekitten.com/201/201/"}];
            }
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            $scope.loading = false;
        });
    }

    $scope.getUserInfo = function() {
        var username = UserService.GetCurrentUserName();
        var token = UserService.GetToken();

        UserService.GetUserInfo(username, token)
        .then(function successCallback(response) {
            $scope.UserInfo = response.data;
            
        }, function errorCallback(response) {
            console.log(response.data.error);
        });
    }

    $scope.getAllPosts();
    $scope.getUserInfo();
    $scope.UserInfo = {};
    $scope.testPostFormData = {};
    $scope.testPostFormData.username = UserService.GetCurrentUserName();

    $scope.createPost = function() {
        PostService.CreatePost($scope.testPostFormData)
        .success(function(data) {
            if(data.status == 500) {
                alert(data.error);
            }
            else if(data.status == 200) {
                console.log(data.success);
                location.reload();
            }
            else {
                alert(data.error);
            }
        });
    }

    $scope.formatDate = function(date) {
        var date = new Date(date);
        var months = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
        ];

        return date.toLocaleTimeString() + ' ' + 
            months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
    }
    
    $scope.loadNail = function(post, elem){
        if(jQuery.inArray(UserService.GetCurrentUserName(), post.users_with_like) > -1) {
            $scope.swapImage(elem);
            if ($(elem).find('img').hasClass('nailed-it-img')) {
                $(elem).find('.nailed-msg').removeClass('bounceIn');
            }
        }
    }

    $scope.nail = function(post, elem) {
        var username = UserService.GetCurrentUserName();
        PostService.LikePost(username, post._id)
        .success(function(data){
           if(data.status == 500) {
                alert(data.error);
            }
            else {
                if(data.status == 201) {
                    post.users_with_like.push(username);
                }
                else {
                    post.users_with_like = post.users_with_like.filter(allPosts => allPosts != username);
                }

                post.num_likes = post.users_with_like.length;

                $scope.swapImage(elem);

                $(elem).find('.nailed-msg').addClass('bounceIn');
            }
        }).error(function(err){
            alert(err);
        });
    }

    $scope.swapImage = function(elem) {
        var nailFilled = "../img/Nail-Filled-50.png";
        var nailEmpty = "../img/Nail-50.png";

        var img = elem.find('img');

        if (!$(img).hasClass('nailed-it-img')) {
            $(img).attr('src', nailFilled);
            $(img).addClass('nailed-it-img');
        } else  {
            $(img).attr('src', nailEmpty);
            $(img).removeClass('nailed-it-img');
        }

        $(elem).find('.nailed-msg').toggle();
    }

    $scope.peopleNailedThis = function(numPeople) {
        if(!numPeople || numPeople == 0) return;
        else return numPeople == 1 ? "1 person nailed this." : numPeople + " people nailed this.";
    }
})
.controller('SignInCtrl', function($scope, $state, $http, $rootScope, UserService, LoginService){

    // Check if user is signed in
    $rootScope.IsUserSignedIn = UserService.IsUserSignedIn();

    $scope.userLogin = {};
    $scope.registerUser = {};

    //Login function - Sends the users login info to the Signin function call on the service.js page
    //The username and token is returned upon a successful login
    //After the user is redirected to the dashboard screen
    $scope.signIn = function() {
        LoginService.Signin($scope.userLogin).success(function(data){
            if(data.status == 500) {
                alert(data.error);
            }
            else if(data.status == 200)
            {
                LoginService.SetToken(data.token, $scope.userLogin.username);
                $state.go('dash');
            }
            else
            {
                console.log(data.error);
				alert(data.error);
            }
        }).error(function(err){
            console.log("Signin Error:");
            console.log(err);
        })
    };

    //Registering function - Sends users information to the SignUp function call on the service.js page
    //This information is user to register the user in the Database for the first time.
    //If a user exists then an error is sent back.
    $scope.signUp = function() {
        if($scope.registerUser.password === $scope.registerUser.passwordConfirm){
            LoginService.SignUp($scope.registerUser).success(function(data){
                if(data.status == 500) {
                    alert(data.error);
                }
                else if(data.status == 200)
                {
                    LoginService.SetToken(data.token, $scope.registerUser.username);
                    $state.go('dash');
                }
                else
                {
                    console.log(data.error);
					alert(data.error);
                }
            }).error(function(err){
                console.log("SignUp Error:");
                console.log(err);
            })
        }else{
            console.log("Passwords Don't Match. Please try again.");
			alert("Passwords Don't Match. Please try again.");
        }
    }

    //Logout function - removes the users token so they have to sign back in to user the site again. 
    $scope.signOut = function() {
        LoginService.SignOut();
        $rootScope.IsUserSignedIn = UserService.IsUserSignedIn();
        //Refresh page
        $state.go('signin');
    };

})
.controller('ProfileCtrl', function($scope, $state, $stateParams, $http, $rootScope, UserService, PostService) {
    // Check if user is signed in
    $rootScope.IsUserSignedIn = UserService.IsUserSignedIn();

    $scope.UserOwnsPage = false;
    if($stateParams.username == undefined || $stateParams.username == "" ) {
        $scope.UserOwnsPage = true;
    }
    else {
        $scope.UserOwnsPage = UserService.UserOwnsPage($stateParams.username, UserService.GetCurrentUserName());
    }

    $scope.getPosts = function(username) {
        $scope.loading = true;
        PostService.GetUserPosts(username).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            console.log("Successfully retrieved posts for user: ", username);
            $scope.posts = response.data;
            $scope.loading = false;

        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            $scope.loading = false;
        });
    }

    $scope.getUserInfo = function(username, userOwnsPage) {
        var token = UserService.GetToken();
    
        if(userOwnsPage) {
            $scope.NoPostsName = "You";
        }

        UserService.GetUserInfo(username, token, userOwnsPage)
        .then(function successCallback(response) {
            $scope.UserInfo = response.data;
            
        }, function errorCallback(response) {
            console.log(response.data.error);
        });
    }

    $scope.getFollowing = function() {
        UserService.GetFollowing(UserService.GetCurrentUserName())
        .then(function successCallback(response) {
                $scope.following = response.data;
                
            }, function errorCallback(response) {
                console.log(response.data);
        });   
    }

    $scope.IsFollowing = function(username) {
        var flag = false;
        for(var user in $scope.following)
        {
            if($scope.following[user].username == username){
                flag = true;
            }
        }
        return flag;
    }

    $scope.updateFollower = function(updatedFollowUsername) {
        UserService.UpdateFollower(UserService.GetCurrentUserName(), updatedFollowUsername)
        .then(function successCallback(response) {
           console.log(response.data);
            location.reload();            
        }, function errorCallback(response) {
            console.log(response.data);
        });
    }

    // $scope.previewFile = function() {
    //     var file    = document.querySelector('input[type=file]').files[0]; //same as here
    //     var reader  = new FileReader();

    //     reader.onloadend = function () {
    //         $scope.profilePicture = reader.result;               
    //     }

    //     if (file) {
    //         reader.readAsDataURL(file); //reads the data as a URL
    //     } else {
    //         $scope.profilePicture = $scope.placeholderImage;
    //     }
    // }

    $scope.deletePost = function(id) {
        var username = UserService.GetCurrentUserName();
        $('#post').addClass('removed-item');
        PostService.DeletePost(username, id)
        .then(function successCallback(response) {
           console.log(response.data);
           location.reload();            
        }, function errorCallback(response) {
            console.log(response);
        });
    }
    
    $scope.placeholderImage = "http://img15.deviantart.net/7a8c/i/2012/226/7/8/christmas_kittens_by_mskrissi87-d5b53bq.jpg";
    $scope.profilePicture = $scope.placeholderImage;
    $scope.NoPostsName = "This user";

    $scope.posts = [];
    $scope.UserInfo = {};

    var u = UserService.GetCurrentUserName();
    if($stateParams.username && $stateParams.username != "") {
        u = $stateParams.username;
    }
    
    $scope.getUserInfo(u, $scope.UserOwnsPage);
    $scope.getFollowing();    
    $scope.getPosts(u);

    $scope.loadNail = function(post, elem){
        if(jQuery.inArray(UserService.GetCurrentUserName(), post.users_with_like) > -1) {
            $scope.swapImage(elem);
            if ($(elem).find('img').hasClass('nailed-it-img')) {
                $(elem).find('.nailed-msg').removeClass('bounceIn');
            }
        }
    }

    $scope.nail = function(post, elem) {
        var username = UserService.GetCurrentUserName();
        PostService.LikePost(username, post._id)
        .success(function(data){
            if(data.status == 500) {
                alert(data.error);
            }
            else {
                if(data.status == 201) {
                    post.users_with_like.push(username);
                }
                else {
                    post.users_with_like = post.users_with_like.filter(allPosts => allPosts != username);
                }

                post.num_likes = post.users_with_like.length;

                $scope.swapImage(elem);

                $(elem).find('.nailed-msg').addClass('bounceIn');
            }
        }).error(function(err){
            console.log("Like Error:", err);
        });
    }

    $scope.swapImage = function(elem) {
        var nailFilled = "../img/Nail-Filled-50.png";
        var nailEmpty = "../img/Nail-50.png";

        var img = elem.find('img');

        if (!$(img).hasClass('nailed-it-img')) {
            $(img).attr('src', nailFilled);
            $(img).addClass('nailed-it-img');
        } else  {
            $(img).attr('src', nailEmpty);
            $(img).removeClass('nailed-it-img');
        }

        $(elem).find('.nailed-msg').toggle();
    }

    $scope.peopleNailedThis = function(numPeople) {
        if(!numPeople || numPeople == 0) return;
        else return numPeople == 1 ? "1 person nailed this." : numPeople + " people nailed this.";
    }
    
})
.controller('FollowCtrl', function($scope, $state, $http, $rootScope, UserService) {
    
    // Check if user is signed in
    $rootScope.IsUserSignedIn = UserService.IsUserSignedIn();

    $scope.getAllUsers = function() {
        $scope.loading = true;        
        UserService.GetAllUsers()
        .then(function successCallback(response) {
                // Remove yourself from the list of users to follow
                $scope.allUsers = response.data.filter(user =>   user.username != UserService.GetCurrentUserName());
                $scope.loading = false;
            }, function errorCallback(response) {
                console.log(response.data);
                $scope.loading = false;                
        });   
    }

    $scope.getFollowing = function() {
        UserService.GetFollowing(UserService.GetCurrentUserName())
        .then(function successCallback(response) {
                $scope.following = response.data;
                
            }, function errorCallback(response) {
                console.log(response.data);
        });   
    }

    $scope.getUserInfo = function() {
        var username = UserService.GetCurrentUserName();
        var token = UserService.GetToken();

        UserService.GetUserInfo(username, token)
        .then(function successCallback(response) {
            $scope.UserInfo = response.data;
            
        }, function errorCallback(response) {
            console.log(response.data);
        });
    }

    $scope.updateFollower = function(updatedFollowUsername) {
        UserService.UpdateFollower(UserService.GetCurrentUserName(), updatedFollowUsername)
        .then(function successCallback(response) {
           console.log(response.data);
            location.reload();            
        }, function errorCallback(response) {
            console.log(response.data);
        });
    }

    $scope.placeholderImage = "http://img15.deviantart.net/7a8c/i/2012/226/7/8/christmas_kittens_by_mskrissi87-d5b53bq.jpg";
    
    $scope.following = {};
    $scope.allUsers = {};
    $scope.UserInfo = {};
    
    $scope.getAllUsers();
    $scope.getFollowing();
    $scope.getUserInfo();

    $scope.IsFollowing = function(username) {
        var flag = false;
        for(var user in $scope.following)
        {
            if($scope.following[user].username == username){
                flag = true;
            }
        }
        return flag;
    }

})
.controller('SearchCtrl', function($scope, $state, $http, UserService, $location){

    $scope.placeholderImage = "http://img15.deviantart.net/7a8c/i/2012/226/7/8/christmas_kittens_by_mskrissi87-d5b53bq.jpg";

    $scope.search = function() {
        $scope.loading = true;        
        $http({
            method  : 'GET',
            url     : '/search?query=' + $location.search().query
        }).success(function(res){
            $scope.loading = false;            
            $scope.searchRes = res;
        }).error(function(err){
            $scope.loading = false;            
            console.log(err);
        });
    }
    
    $scope.search();
});
