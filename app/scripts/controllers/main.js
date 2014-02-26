angular.module('statusieApp')
    .controller('MainCtrl', function ($scope, Status) {
        'use strict';

        var features;

        Status.load()
            .then(function (data) {
                features = data.features;

                $scope.features = _.clone(features);
                $scope.categories = data.categories;
            });

        $scope.$watch('filters', function (newValue) {
            //We stop watching because there is a new category going on
            if(!features){
                return;
            }
            var filteredFeatures = _.clone(features);
            _.forOwn($scope.filters, function (categoryFilters) {
                _.forEach(categoryFilters, function (value) {
                    filteredFeatures = _.reduce(features, value);
                    console.log(filteredFeatures);
                });
            });

            $scope.features = filteredFeatures;

        }, true);
    });