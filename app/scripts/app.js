angular.module('statusieApp', [
    'ngCookies',
    'ngSanitize',
    'ngRoute',
    'pasvaz.bindonce',
    'ui.bootstrap'
])
    .config(function ($routeProvider) {
        'use strict';
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
