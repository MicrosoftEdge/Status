// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the Apache License, Version 2.0 (the "License"); you may not use these files except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
angular.module('statusieApp')
    .directive('featuresorting', function () {
        return {
            templateUrl: 'templates/featuresorting.html',
            restrict: 'E',
            replace: true,
            controller: function ($location, $scope) {
                'use strict';

                var statusOrder = {
                    "in development": 0,
                    "under consideration": 1,
                    "researching": 2,
                    "shipped": 3,
                    "prefixed": 4,
                    "not currently planned": 5
                };

                var sorts = [
                    {
                        name: 'name',
                        sortFunction: function (feature) {
                            return feature.normalized_name;
                        },
                        selected: true
                    },
                    {
                        name: 'technology',
                        sortFunction: function (feature) {
                            return feature.normalized_category;
                        }},
                    {
                        name: 'status',
                        sortFunction: function (feature) {
                            var lowerStatus = feature.position.toLowerCase();

//                            var prefixedVersion = _.isNaN(feature.browsers.ie.prefixed) ? 100 : feature.browsers.ie.prefixed;
//                            var unprefixedVersion = _.isNaN(feature.browsers.ie.unprefixed) ? 100 : feature.browsers.ie.unprefixed;

                            if (lowerStatus === 'shipped') {
                                return statusOrder[lowerStatus] + (feature.browsers.ie.unprefixed - 8) / 10;
                            } else if (lowerStatus === 'prefixed') {
                                return statusOrder[lowerStatus] + (feature.browsers.ie.prefixed - 8) / 10;
                            }

                            return statusOrder[feature.position.toLowerCase()];
                        }
                    },
                    {
                        name: 'votes',
                        sortFunction: function (feature) {
                            if (!feature.uservoice) {
                                return 0;
                            }
                            return -feature.uservoice.votes;
                        }}
                ];
                $scope.sorts = sorts;

                var sortChanged = function () {
                    //TODO: sanitize this
                    var sortName = $location.search()['sort'];
                    var sort = _.find(sorts, {name: sortName});

                    if (!sortName || !sort) {
                        sortName = 'name'
                    }

                    $scope.selectedSort = {
                        name: sortName
                    };
                };

                //We check if the user is accessing the website with some sorting
                sortChanged();

                $scope.$on('backNavigation', sortChanged);

                $scope.$watch('selectedSort.name', function (newValue, oldValue) {
                    if (newValue && (newValue !== oldValue || $location.search()['sort'])) {
                        var sort = _.find(sorts, {name: newValue});

                        if (oldValue) {
                            $location.search('sort', newValue);
                        }

                        $scope.sort = sort.sortFunction;
                    }
                }, true);
            }
        };
    });
