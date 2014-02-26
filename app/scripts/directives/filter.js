'use strict';

angular.module('statusieApp')
    .directive('filter', function () {
        return {
            templateUrl: 'templates/filter.html',
            restrict: 'E',
            replace: true,
            link: function postLink(scope, element, attrs) {
                scope.filters = {};
                var watchers = [];
            }
        };
    });
