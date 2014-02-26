'use strict';

angular.module('statusieApp')
    .directive('areafilter', function () {
        return {
            templateUrl: '/templates/areafilter.html',
            replace: true,
            restrict: 'E',
            link: function postLink(scope, element, attrs) {
                scope.allCategories = true;

//                element.text('this is the areaFilter directive');
            }
        };
    });
