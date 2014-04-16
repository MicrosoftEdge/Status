angular.module('statusieApp')
    .directive('sticky', function ($window) {
        'use strict';

        return {
            restrict: 'A',
            link: function postLink(scope, element) {
                element = element[0];
                var topOffset = element.offsetTop;
                var $win = angular.element($window);
                var originalClasses = element.className;
                var locked = false,
                    calculated = false;



                var div = document.createElement('div');
                div.className = "hide sticky";

                var parent = element.parentNode;

                var fill = parent.insertBefore(div, element);

                var process = function () {
                    var needsLock = $win[0].scrollY >= topOffset;
                    if (needsLock !== locked) {
                        locked = needsLock;
                        if (locked) {
                            if(!calculated){
                                fill.style.height = element.offsetHeight + 'px';
                                calculated = true;
                            }

                            element.className = originalClasses + ' fixed';
                            fill.className = "sticky";
                        } else {
                            element.className = originalClasses;
                            fill.className = "hide sticky";
                        }
                    }
                };

                $win.on('scroll', requestAnimationFrame.bind(null, process));
            }
        };
    });
