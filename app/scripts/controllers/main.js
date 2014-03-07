angular.module('statusieApp')
    .controller('MainCtrl', function ($scope, Status) {
        'use strict';

        var features;

        var nameSort = function(feature){
            return feature.name;
        };

        Status.load()
            .then(function (data) {
                features = _.sortBy(_.forEach(data.features, function(feature){
                    feature.visible = true;
                }), nameSort);

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

            filteredFeatures = _.sortBy(filteredFeatures, nameSort);

            var names = _.pluck(filteredFeatures, 'name');

            _.forEach($scope.features, function(feature){
                feature.visible =_.contains(names, feature.name);
            });

            $scope.limit = filteredFeatures.length;
        });
    });