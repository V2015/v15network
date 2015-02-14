
var site = angular.module('site', ['ui.router']);//['ngRoute','ui.bootstrap']

// site.config(function($routeProvider) {
//     $routeProvider
//         // route for the home page
//         .when('/', {
//             templateUrl : 'pages/login.html',
//             controller  : 'mainController'
//         });
// });

site.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /login
  $urlRouterProvider.otherwise("/login");
  //
  // Now set up the states
  $stateProvider
    .state('login', {
      url: "/login",
      templateUrl: "pages/login.html"
    })
    .state('swipe', {
      url: "/swipe",
      templateUrl: "pages/swipe.html",
      controller: 'mainController'
    })
});

// site.config(function ($httpProvider) {
//     $httpProvider.interceptors.push('authInterceptor');
// });

// site.run(function(editableOptions) {
//   editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
// });

// angular.element(document).ready(function() {
//       angular.bootstrap(document, ['site']);
// });

