angular.module('statusieApp')
    .directive('sticky', function ($window) {
        'use strict';

        return {
            restrict: 'A',
            link: function postLink(scope, element) {
                var topOffset = element.offset().top;
                var $win = angular.element($window);
                var locked = false;

                var fill = $('<div class="hide"></div>').insertBefore(element);

                var process = function () {
                    var needsLock = $win.scrollTop() >= topOffset;
                    if (needsLock !== locked) {
                        locked = needsLock;
                        if (locked) {
                            fill.height(element.height());
                            element.addClass('fixed');
                            fill.removeClass('hide');
                        } else {
                            element.removeClass('fixed');
                            fill.addClass('hide');
                        }
                    }
                };

                $win.on('scroll', requestAnimationFrame.bind(null, process));
            }
        };
    });
