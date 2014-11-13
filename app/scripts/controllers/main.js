// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the Apache License, Version 2.0 (the "License"); you may not use these files except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
angular.module('statusieApp')
    .controller('MainCtrl', function ($scope, $location, $timeout, $window, Status) {
        'use strict';

        var features,
            filters = {},
            loaded = false,
            needsFiltering = false;

        $scope.features = [];
        $scope.limit = 0;
        $scope.loading = true;

        var scrollToFeature = function (id) {
            if (id) {
                var ele = document.getElementById(id);
                if (ele) {
                    $timeout(function () {
                        ele.scrollIntoView();
                        window.scrollTo(0, (window.scrollY || document.documentElement.scrollTop) - 135);
                    }, 0);
                }
            }
        };

        var insertPromise;

        var insertFeatures = function (features, callback) {
            var featuresCp = _.clone(features);
            $scope.features = [];

            if (insertPromise) {
                $timeout.cancel(insertPromise);
            }

            var insertFeature = function () {
                if (featuresCp.length > 0) {
                    $scope.features.push.apply($scope.features, featuresCp.splice(0, 5));
                    insertPromise = $timeout(insertFeature, 0);
                } else {
                    insertPromise = null;

                    if (callback) {
                        callback();
                    }
                }
            };

            insertPromise = $timeout(insertFeature, 0);
        };

        var getFeatureId = function () {
            var path = $location.path();
            return path.substr(1) || "";
        };

        var trackFeature = function (id) {
            _gaq.push(['_trackPageview', '/status/' + id]);
        };

        var filterFeatures = function () {
            var filteredFeatures = _.clone(features);

            _.forOwn(filters, function (filter) {
                filteredFeatures = _.reduce(filteredFeatures, filter, []);
            });

            var names = _.pluck(filteredFeatures, 'name');

            //Its faster to check the names of the features and hide them than replacing the items with new ones
            _.forEach($scope.features, function (feature) {
                feature.visible = _.contains(names, feature.name);
            });

            $scope.limit = (filteredFeatures || []).length;
        };

        $scope.$on('filterupdated', function (event, data) {
            filters[data.name] = data.filterFunction;

            if (loaded) {
                filterFeatures();
            } else {
                needsFiltering = true;
            }
        });

        $scope.$watch('sort', function (sortFunction) {
            insertFeatures(_.sortBy(features, sortFunction));
        });


        Status.load()
            .then(function (data) {
                $scope.categories = data.categories;
                $scope.featureStatus = data.ieVersions;
                $scope.loading = false;

                features = _.sortBy(_.forEach(data.features, function (feature) {
                    feature.visible = true;
                }), $scope.sort || function (feature) { return feature.normalized_name;});

                $scope.limit = features.length;

                insertFeatures(features, function () {
                    loaded = true;
                    if (needsFiltering) {
                        needsFiltering = false;
                        filterFeatures();
                    }

                    $scope.$on('$locationChangeSuccess', function () {
                        var featureId = getFeatureId();
                        trackFeature(featureId);
                    });

                    // We only want to autoscroll if navigating directly to a feature or in back navigation
                    $window.onpopstate = function () {
                        $scope.$apply(function () {
                            var featureId = getFeatureId();
                            scrollToFeature(featureId);

                            $scope.$emit('backNavigation');
                        });
                    };

                    var featureId = getFeatureId();
                    trackFeature(featureId);
                    scrollToFeature(featureId);
                });
            });
    });