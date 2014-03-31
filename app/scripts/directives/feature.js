'use strict';

angular.module('statusieApp')
    .directive('feature', function () {
        return {
            templateUrl: '/templates/feature.html',
            restrict: 'E',
            replace: true,
            controller: function($scope){
                $scope.$on('filtersUpdated', function () {
                    $scope.show = false;
                });
            },
            link: function (scope, element, attrs) {
                var featureName = $(element).find('h1.feature_name');
                var featureInfoWidth = $(element).find('.feature-info').width();
                featureName.css('max-width', 'calc(100% - ' + (featureInfoWidth + 10) + 'px)');
            }
        };
    });
