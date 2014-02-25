'use strict';

angular.module('statusieApp')
    .directive('feature', function () {
        return {
            templateUrl: '/templates/feature.html',
            restrict: 'E',
            replace: true,
            link: function postLink(scope, element, attrs) {
                //TODO: this should be done with bindings
                element.find('.collapsebtn').on('click', function () {
                    element.toggleClass('show');
                });
//        element.text('this is the feature directive');
            }
        };
    });
