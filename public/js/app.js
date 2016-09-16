angular.module('hammer', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
        
    // Views and Routes
    .state('dash', {
        url: '/dashboard',
        templateUrl: 'templates/dash.html'
    })
    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html'
    })
    .state('profile', {
        url: '/profile',
        templateUrl: 'templates/profile.html'
    });
    
    $urlRouterProvider.otherwise('/dash')  
});