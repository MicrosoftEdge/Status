angular.module('statusieApp', [
    'ngCookies',
    'ngSanitize',
    'pasvaz.bindonce',
    'ui.bootstrap'
])
    .config(function ($locationProvider) {
        'use strict';
        $locationProvider.html5Mode(true);
    });
