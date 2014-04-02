angular.module('statusieApp')
    .directive('featuresorting', function () {
        return {
            templateUrl: 'templates/featuresorting.html',
            restrict: 'E',
            controller: function ($scope) {
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
                            return feature.name.toLowerCase().replace(/</g, '');
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
                    }
                ];
                $scope.sorts = sorts;

                $scope.selectedSort = {
                    name: 'name'
                };

                $scope.$watch('selectedSort.name', function (newValue, oldValue) {
                    if (newValue) {
                        var sort = _.find(sorts, function (sort) {
                            return sort.name === newValue;
                        });

                        $scope.sort = sort.sortFunction;
                    }
                });
            }
        };
    });
