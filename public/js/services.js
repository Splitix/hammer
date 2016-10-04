angular.module('hammer.services', ['ngCookies'])
.service('LoginService', function() {

    this.Signin = function(userLogin) {
        return $http.post('/signin', $.param(userLogin));
    }

    this.SignUp = function(userRegister) {
        return $http.post('/signup', $.param(userRegister));
    }

    this.SignOut = function() {
        $cookies.remove('token');
    }

    this.SetToken = function(token) {
        var today = new Date();
        var expired = new Date(today);
        expired.setDate(today.getDate() + 1); //Set expired date to tomorrow
        $cookies.put('token', token, {expires : expired });
    }
})

.service('UserService', function($cookies) {

    this.IsUserSignedIn = function() {
        return $cookies.get('token') !== undefined;
    }
    
});