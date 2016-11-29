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
.service('UserService', function($cookies, $http) {

    this.GetCurrentUserName = function() {
        return $cookies.get('username');
    }

    this.GetToken = function() {
        return $cookies.get('token');
    }

    this.IsUserSignedIn = function() {
        return $cookies.get('token') !== undefined;
    }

    this.GetUserInfo = function(username, token, userOwnsPage) {
        return $http({
            method  : 'POST',
            url     : '/userInfo',
            data    : $.param({username: username, token: token, userOwnsPage: userOwnsPage}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    }

    this.GetAllUsers = function() {
        return $http({
            method  : 'GET',
            url     : '/users'
        });
    }
    
    this.GetFollowing = function(username) {
        return $http({
            method  : 'GET',
            url     : '/following?username=' + username
        });
    }

     this.UpdateFollower = function(currentUsername, updatedFollow) {
        return $http({
            method  : 'POST',
            url     : '/updateFollower',
            data    : $.param({username: currentUsername, updatedFollow: updatedFollow}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    }

    this.UserOwnsPage = function(stateParamsUser, username) {
        return stateParamsUser == username;
    }
})
.service('PostService', function($http) {

    this.GetAllPosts = function(username) {
        return $http({
        method  : 'GET',
        url     : '/allPosts?username=' + username
        });
    }

    this.GetUserPosts = function(username) {
        return $http({
        method  : 'GET',
        url     : '/userPosts?username=' + username 
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

    this.DeletePost = function(username, postId) {
        return $http({
        method  : 'DELETE',
        url     : '/deletePost',
        data    : $.param({username: username, id: postId}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    }

    this.UpdateLike = function(currentUsername, updatedLike) {
        return $http({
            method  : 'POST',
            url     : '/updateLike',
            data    : $.param({username: currentUsername, updatedLike: updatedLike}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    }
});