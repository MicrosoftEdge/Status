angular.module('statusieApp')
    .controller('MainCtrl', function ($scope, Status) {
        'use strict';

        var features;

        Status.load()
            .then(function (data) {
                features = data.features;

                $scope.features = _.clone(features);
                $scope.categories = data.categories;
                $scope.browsers = data.browsers;
                $scope.featureStatus = data.ieVersions;
            });

        $scope.limit = 0;

        $scope.$on('filtersUpdated', function () {
            var filteredFeatures = _.clone(features);
            //TODO: optimize these iterations, maybe do it over features and apply all rules?
            _.forOwn($scope.filters, function (categoryFilters) {
                if (!Array.isArray(categoryFilters)) {
                    return;
                }
                _.forEach(categoryFilters, function (value) {
                    filteredFeatures = _.reduce(filteredFeatures, value);
                });
            });

            $scope.features = _.sortBy(filteredFeatures, function (feature) {
                return feature.name;
            });

            $scope.limit = $scope.features.length;
        });
    });