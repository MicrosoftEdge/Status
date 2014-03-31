angular.module('statusieApp')
    .controller('MainCtrl', function ($scope, Status) {
        'use strict';

        var features;

        $scope.limit = 0;
        $scope.loading = true;

        $scope.$watch('sort', function(sortFunction){
               $scope.features = _.sortBy(features, sortFunction);
        });

        $scope.$on('filtersUpdated', function () {
            var filteredFeatures = _.clone(features);

            _.forOwn($scope.filters, function (categoryFilters) {
                if (!Array.isArray(categoryFilters)) {
                    return;
                }
                _.forEach(categoryFilters, function (filter) {
                    filteredFeatures = _.reduce(filteredFeatures, filter, []);
                });
            });

//            filteredFeatures = _.sortBy(filteredFeatures, sorts.technology);

            var names = _.pluck(filteredFeatures, 'name');

            _.forEach($scope.features, function(feature){
                feature.visible =_.contains(names, feature.name);
            });

            $scope.limit = (filteredFeatures || []).length;
        });

        Status.load()
            .then(function (data) {
                features = _.sortBy(_.forEach(data.features, function(feature){
                    feature.visible = true;
                }), $scope.sort);

                $scope.features = _.clone(features);
                $scope.categories = data.categories;
                $scope.browsers = data.browsers;
                $scope.featureStatus = data.ieVersions;
                $scope.loading = false;
            });
    });