angular.module('hammer.controllers', ['ngCookies'])

.controller('DashCtrl', function($scope, $state, $http, $cookies){
    
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

.controller('SignInCtrl', function($scope, $state, $http, $cookies){

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
                console.log(data.success);
                $scope.SetToken(data.token);
                //$state.go('/#/dashboard');
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
                console.log(data.success);
                $scope.SetToken(data.token);
                //$state.go('/#/dashboard');
            }
            else {
                console.log(data.error);
            }
        });
    };


    $scope.SetToken = function(token) {
        var today = new Date();
        var expired = new Date(today);
        expired.setDate(today.getDate() + 1); //Set expired date to tomorrow
        $cookies.put('token', token, {expires : expired });
    }

})
.controller('ProfileCtrl', function($scope, $state, $http, $cookies){
    // Set values of variables used in the view
    $scope.FirstName = "Blake";
    $scope.LastName = "Bordovsky";
    $scope.ImageUri = "http://placekitten.com/200/200/";
});