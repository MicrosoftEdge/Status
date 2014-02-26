angular.module('statusieApp')
    .controller('MainCtrl', function ($scope, Status) {
        'use strict';

        Status.load()
            .then(function (data) {
                $scope.features = data;
            });
    });