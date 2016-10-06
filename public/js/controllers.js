angular.module('hammer.controllers', [])

.controller('DashCtrl', function($scope, $state, $http, $rootScope, UserService){
    
    // Check if user is signed in    
    $rootScope.IsUserSignedIn = UserService.IsUserSignedIn();

    $scope.GetAllPosts = function() {
        $scope.loading = true;
        $http({
        method: 'GET',
        url: '/allPosts'
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            console.log("Successfully retrieved posts", response.data);
            $scope.posts = response.data;
            $scope.loading = false;
            if(JSON.stringify($scope.posts) === JSON.stringify({})){
                // Some mockup posts
                $scope.posts = [
                {body: "Here are some sample posts because there weren't any in the database.", name: "Blake Bordovsky", imageUri : "http://placekitten.com/100/200/"},
                {body: "We'll throw some old gray clouds in here just sneaking around and having fun. Tree trunks grow however makes them happy. That's what painting is all about. It should make you feel good when you paint. Just pretend you are a whisper floating across a mountain. We need dark in order to show light. With something so strong, a little bit can go a long way.",
                name: "Bob Ross", imageUri : "http://www.bobrosslipsum.com/images/bob-ross-cutout.png"},
                {body: "Hammer is super cool.", name: "Joshua Galindo", imageUri : "http://placekitten.com/200/200/"},
                {body: "Testing out this user post.", name: "Blake Bordovsky", imageUri : "http://placekitten.com/200/200/"},
                {body: "The chicken noodles in Harris Hall were satisfactory.", name: "Jason Flinn", imageUri : "http://placekitten.com/200/200/"},
                {body: "San Marcos is flooding super bad right now!", name: "Blake Bordovsky", imageUri : "http://placekitten.com/200/200/"},
                {body: "Project Hammer is using the MEAN stack.", name: "Joshua Galindo", imageUri : "http://placekitten.com/200/200/"}];
            }
            
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            $scope.loading = false;
        });
    }

    $scope.GetAllPosts();
    $scope.testPostFormData = {};
    $scope.testPostFormData.username = UserService.GetCurrentUserName();

    $scope.CreatePost = function() {
        $http({
        method  : 'POST',
        url     : '/createPost',
        data    : $.param($scope.testPostFormData),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data) {
            if(data.status == 200) {
                console.log(data.success);
                $state.go('dash');                
            }
            else {
                console.log(data.error);
            }
        });
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
            LoginService.SetToken(data.token, $scope.signInFormData.username);
            $state.go('dash');
        }).error(function(err){
            console.log("Signin Error:");
            console.log(err);
        })
    };

    //Registering function - Sends users information to the SignUp function call on the service.js page
    //This information is user to register the user in the Database for the first time.
    //If a user exists then an error is sent back.
    $scope.signUp = function() {
        if(registerUser.password === registerUser.passwordConfirm){
            LoginService.SignUp().success(function(data){
                LoginService.SetToken(data.token);
                $state.go('dash');
            }).error(function(err){
                console.log("SignUp Error:");
                console.log(err);
            })
        }else{
            console.log("Passwords Don't Match. Please try again.")
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
.controller('ProfileCtrl', function($scope, $state, $http, $rootScope, UserService) {

    // Check if user is signed in
    $rootScope.IsUserSignedIn = UserService.IsUserSignedIn();

    // Set values of variables used in the view
    $scope.FirstName = "Blake";
    $scope.LastName = "Bordovsky";
    $scope.ImageUri = "http://placekitten.com/200/200/";
});