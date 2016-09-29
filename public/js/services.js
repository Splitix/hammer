angular.module('hammer.services', ['ngCookies'])
.service('UserService', function($cookies) {

    this.IsUserSignedIn = function() {
        return $cookies.get('token') !== undefined;
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
});