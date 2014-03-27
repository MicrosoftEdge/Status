'use strict';

angular.module('statusieApp')
    .directive('featuresorting', function () {
        return {
            templateUrl: 'templates/featuresorting.html',
            restrict: 'E',
            controller: function ($scope) {
                var statusOrder = {
                    "in development": 0,
                    shipped: 3,
                    "prefixed": 4,
                    "under consideration": 1,
                    researching: 2,
                    "not currently planned": 5,
                    "no plans to support": 6
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
                            return statusOrder[feature.position.toLowerCase()];
                        }
                    }
                ];
                $scope.sorts = sorts;

                $scope.selectedSort = {
                    name: 'name'
                };

                $scope.$watch('selectedSort.name', function(newValue,oldValue){
                    if(newValue){
                        var sort = _.find(sorts, function(sort){
                            return sort.name === newValue;
                        });

                        $scope.sort = sort.sortFunction;
                    }
                });
            }
        };
    });
