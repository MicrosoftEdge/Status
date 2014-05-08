angular.module('statusieApp')
    .directive('arrownavigation', function () {
        'use strict';
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                var container = element[0];
                var cancelTimer;

                var findIndex = function (element, elements) {
                    var index, l;

                    for (index = 0, l = elements.length; index < l; index++) {
                        if (elements[index] === element) {
                            return index;
                        }
                    }
                };

                var next = function (elements) {
                    return function (index) {
                        if (typeof index === 'number') {
                            return elements[index + 1];
                        }
                    };
                };

                var previous = function (elements) {
                    return function (index) {
                        if (typeof index === 'number') {
                            return elements[index - 1];
                        }
                    };
                };

                var focus = function (element) {
                    if (element) {
                        element.focus();
                    }
                };

                var arrowAction = function(action){
                    var activeElement = document.activeElement;
                    var elements = container.querySelectorAll(activeElement.tagName.toLowerCase());
                    var nextElementTo = action(elements);

                    focus(nextElementTo(findIndex(activeElement, elements)));
                };

                var keydown = function (event) {
                    var key = event.keyCode;
                    var handled = true;
                    //right or down
                    if (key === 39 || key === 40) {
                        arrowAction(next);
                        //up or left
                    } else if (key === 38 || key === 37) {
                        arrowAction(previous);

                    }else{
                        handled = false;
                    }

                    if(handled){
                        event.stopPropagation();
                        event.preventDefault();
                    }
                };

                var activate = function () {
                    clearTimeout(cancelTimer);
                    container.addEventListener('blur', deactivate, true);
                    document.addEventListener('keydown', keydown, false);
                };

                var deactivate = function () {
                    //We need a timer because blur is fired for that element and then right after that the focus
                    // is fired again. By queueing it up at the end, the blur is only fired when needed:
                    // [ele1]focus --> [ele1]blur (action gets queued up)--> [ele2]focus (this clears the timer if needed)
                    cancelTimer = setTimeout(function () {
                        document.removeEventListener('keydown', keydown, false);
                    }, 0);
                };


                container.addEventListener('focus', activate, true);

//                element.on('focus', activate);
//                element.on('blur', deactivate);
            }
        };
    });
