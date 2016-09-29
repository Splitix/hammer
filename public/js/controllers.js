angular.module('hammer.controllers', [])

.controller('DashCtrl', function($scope, $state, $http, $rootScope, UserService){
    
    // Check if user is signed in    
    $rootScope.IsUserSignedIn = UserService.IsUserSignedIn();

    // Some mockup posts
    $scope.posts = [
    {body: "We'll throw some old gray clouds in here just sneaking around and having fun. Tree trunks grow however makes them happy. That's what painting is all about. It should make you feel good when you paint. Just pretend you are a whisper floating across a mountain. We need dark in order to show light. With something so strong, a little bit can go a long way.",
    author: "Bob Ross", imageUri : "http://www.bobrosslipsum.com/images/bob-ross-cutout.png"},
    {body: "Hammer is super cool.", author: "Joshua Galindo", imageUri : "http://placekitten.com/200/200/"},
    {body: "Testing out this user post.", author: "Blake Bordovsky", imageUri : "http://placekitten.com/200/200/"},
    {body: "The chicken noodles in Harris Hall were satisfactory.", author: "Jason Flinn", imageUri : "http://placekitten.com/200/200/"},
    {body: "San Marcos is flooding super bad right now!", author: "Blake Bordovsky", imageUri : "http://placekitten.com/200/200/"},
    {body: "Project Hammer is using the MEAN stack.", author: "Joshua Galindo", imageUri : "http://placekitten.com/200/200/"}];
})

.controller('SignInCtrl', function($scope, $state, $http, $rootScope, UserService){

    // Check if user is signed in
    $rootScope.IsUserSignedIn = UserService.IsUserSignedIn();

    $scope.signInFormData = {};
    $scope.signUpFormData = {};

    $scope.SignIn = function() {
        $http({
        method  : 'POST',
        url     : '/signin',
        data    : $.param($scope.signInFormData),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data) {
            if(data.status == 200) {
                UserService.SetToken(data.token);
                $state.go('dash');
            }
            else {
                console.log(data.error);
            }
        });
    };

    $scope.SignUp = function() {
        $http({
        method  : 'POST',
        url     : '/signup',
        data    : $.param($scope.signUpFormData),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data) {
            if(data.status == 200) {
                UserService.SetToken(data.token);
                $state.go('dash');
            }
            else {
                console.log(data.error);
            }
        });
    };

    $scope.SignOut = function() {
        UserService.SignOut();
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