angular.module('statusieApp')
    .directive('dropdownToggle', function ($document, $timeout) {
        'use strict';

        return {
            restrict: 'C',
            link: function postLink(scope, element) {
                var parent = element.parent();
                var opened = false;
                var dropdownMenu = parent[0].querySelector('.dropdown-menu');

                dropdownMenu.setAttribute('aria-hidden', 'true');

                var close = function (evt) {
                    if (!opened) {
                        return;
                    }

                    if (evt) {
                        evt.stopPropagation();
                    }

                    opened = false;
                    parent.removeClass('open');
                    element[0].setAttribute('aria-pressed', 'false');
                    dropdownMenu.setAttribute('aria-hidden', 'true');
                    $document.off('click', close);
                };

                var open = function (evt) {
                    if (opened) {
                        close(evt);
                    } else {
                        opened = true;
                        parent.addClass('open');
                        $timeout(function () {
                            $document.on('click', close);
                        }, 0);
                        element[0].setAttribute('aria-pressed', 'true');
                        dropdownMenu.setAttribute('aria-hidden', 'false');
                    }
                };

                element.on('click', open);
//                parent.on('focus', open);
//                element.on('blur', close);
            }
        };
    });
