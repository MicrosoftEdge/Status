angular.module('statusieApp')
    .directive('feature', function () {
        return {
            templateUrl: '/templates/feature.html',
            restrict: 'E',
            replace: true,
            controller: function ($scope, $location) {
                'use strict';
                $scope.$on('filtersUpdated', function () {
                    $scope.show = false;
                });

                $scope.expand = function () {
                    $scope.show = !$scope.show;
                    if ($scope.show) {
                        $location.path('/' + $scope.feature.normalized_name);
                    }
                };

                var id = $location.path();
                if (id === '/' + $scope.feature.normalized_name) {
                    $scope.show = true;
                }
            }
        };
    });
