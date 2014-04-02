angular.module('statusieApp')
    .directive('feature', function () {
        return {
            templateUrl: '/templates/feature.html',
            restrict: 'E',
            replace: true,
            controller: function($scope){
                'use strict';
                $scope.$on('filtersUpdated', function () {
                    $scope.show = false;
                });
            }
        };
    });
