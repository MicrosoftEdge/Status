'use strict';

angular.module('statusieApp', [
    'ngCookies',
    'ngSanitize',
    'ngRoute',
    'pasvaz.bindonce',
    'ui.bootstrap'
])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
