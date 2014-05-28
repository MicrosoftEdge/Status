// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the Apache License, Version 2.0 (the "License"); you may not use these files except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
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
                    var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
                    var needsLock = scrollTop >= topOffset;
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
