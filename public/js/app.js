angular.module('hammer', ['ui.router', 'hammer.controllers', 'hammer.services', 'hammer.directives'])

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
        url: '/u/:username',
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl'
    })
    .state('following', {
        url: '/following',
        templateUrl: 'templates/follow.html',
        controller: 'FollowCtrl'
    })
    .state('search', {
        url: '/search:query',
        templateUrl: 'templates/search.html',
        controller: 'SearchCtrl'
    });
    
    // Route not found go to /dashboard
    $urlRouterProvider.otherwise('/dashboard');
});