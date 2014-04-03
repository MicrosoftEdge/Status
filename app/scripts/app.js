angular.module('statusieApp', [
    'ngCookies',
    'ngSanitize',
    'ngRoute',
    'pasvaz.bindonce',
    'ui.bootstrap'
])
    .config(function ($routeProvider, $locationProvider) {
        'use strict';
        $routeProvider
            .when('/:id', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            });

        $locationProvider.html5Mode(true);
    });
