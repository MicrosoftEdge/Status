angular.module('statusieApp')
    .directive('onfinishrender', function ($timeout) {
        'use strict';
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        };
    });
