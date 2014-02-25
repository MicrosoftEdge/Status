'use strict';

angular.module('statusieApp')
    .directive('feature', function () {
        return {
            templateUrl: '/templates/feature.html',
            restrict: 'E',
            replace: true,
            link: function postLink(scope, element, attrs) {
            }
        };
    });
