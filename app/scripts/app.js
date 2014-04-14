angular.module('statusieApp', [
    'pasvaz.bindonce',
    'ui.bootstrap'
])
    .config(function ($locationProvider) {
        'use strict';
        $locationProvider.html5Mode(true);
    });
