// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the Apache License, Version 2.0 (the "License"); you may not use these files except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
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
            }
        };
    });
