angular.module('statusieApp')
    .directive('sticky', function ($window) {
        'use strict';

        return {
            restrict: 'A',
            link: function postLink(scope, element) {
                var topOffset = element.offset().top;
                var $win = angular.element($window);
                var locked = false;

                var process = function () {
                    var needsLock = $win.scrollTop() >= topOffset;
                    if (needsLock !== locked) {
                        locked = needsLock;
                        if (locked) {
                            element.addClass('fixed');
                        } else {
                            element.removeClass('fixed');
                        }
                    }
                };

                $win.on('scroll', requestAnimationFrame.bind(null, process));
            }
        };
    });
