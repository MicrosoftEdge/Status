angular.module('statusieApp', [
    'pasvaz.bindonce'
])
    .config(function ($locationProvider) {
        'use strict';
        $locationProvider.html5Mode(true);
    });
