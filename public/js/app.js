angular.module('hammer', ['ui.router', 'hammer.controllers', 'hammer.services'])

.config(function($stateProvider, $urlRouterProvider) {
    
    // Views and Routes
    $stateProvider
    .state('dash', {
        url: '/dashboard',
        templateUrl: 'templates/dash.html',
        controller: 'DashCtrl'
    })
    .state('signin', {
        url: '/signin',
        templateUrl: 'templates/signin.html',
        controller: 'SignInCtrl'
    })
    .state('profile', {
        url: '/profile',
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl'
    });
    
    // Route not found go to /dashboard
    $urlRouterProvider.otherwise('/dashboard');
});