angular.module('hammer.services', ['ngCookies'])
.service('LoginService', function($http, $cookies) {

    this.Signin = function(userLogin) {
        return $http({
        method  : 'POST',
        url     : '/signin',
        data    : $.param(userLogin),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    }

    this.SignUp = function(userRegister) {
        return $http({
        method  : 'POST',
        url     : '/signup',
        data    : $.param(userRegister),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    }

    this.SignOut = function() {
        $cookies.remove('username');
        $cookies.remove('token');
    }

    this.SetToken = function(token, username) {
        var today = new Date();
        var expired = new Date(today);
        expired.setDate(today.getDate() + 1); //Set expired date to tomorrow
        $cookies.put('username', username, {expires : expired });        
        $cookies.put('token', token, {expires : expired });
    }
})
.service('UserService', function($cookies) {

    this.GetCurrentUserName = function() {
        return $cookies.get('username');
    }

    this.IsUserSignedIn = function() {
        return $cookies.get('token') !== undefined;
    }    
})
.service('PostService', function($http) {

    this.GetAllPosts = function() {
        return $http({
        method  : 'GET',
        url     : '/allPosts'
        });
    }

    this.CreatePost = function(postData) {
        return $http({
        method  : 'POST',
        url     : '/createPost',
        data    : $.param(postData),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    }
});