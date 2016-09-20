angular.module('hammer', ['ui.router', 'hammer.controllers'])

.config(function($stateProvider, $urlRouterProvider) {
    
    // Views and Routes
    $stateProvider
    .state('dash', {
        url: '/dashboard',
        templateUrl: 'templates/dash.html',
        controller: 'DashCtrl'
    })
    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    })
    .state('signup', {
        url: '/signup',
        templateUrl: 'templates/signup.html',
        controller: 'SignUpCtrl'
    })
    .state('profile', {
        url: '/profile',
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl'
    });
    
    // Route not found goto /dashboard
    $urlRouterProvider.otherwise('/dashboard');
});