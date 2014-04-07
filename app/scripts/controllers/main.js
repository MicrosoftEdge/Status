angular.module('statusieApp')
    .controller('MainCtrl', function ($scope, $location, $timeout, Status) {
        'use strict';

        var features;

        $scope.features = [];
        $scope.limit = 0;
        $scope.loading = true;

        var scrollToFeature = function(){
            var path = $location.path();
            if (path) {
                var id = path.substr(1);
                var ele = document.getElementById(id);
                if (ele) {
                    ele.scrollIntoView();
                    window.scrollTo(0, (window.scrollY || document.documentElement.scrollTop) - 130);
                }
            }
        };

        var insertFeatures = function (features, scroll) {
            var featuresCp = _.clone(features);
            $scope.features = [];

            var insertFeature = function () {
                if (featuresCp.length > 0) {
                    $scope.features.push.apply($scope.features, featuresCp.splice(0, 5));
                    $timeout(insertFeature, 0);
                }else if(scroll){
                    scrollToFeature();
                }
            };

            $timeout(insertFeature, 0);
        };

        $scope.$watch('sort', function (sortFunction) {
            insertFeatures(_.sortBy(features, sortFunction));
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

            var names = _.pluck(filteredFeatures, 'name');

            _.forEach($scope.features, function (feature) {
                feature.visible = _.contains(names, feature.name);
            });

            $scope.limit = (filteredFeatures || []).length;
        });

        Status.load()
            .then(function (data) {
                features = _.sortBy(_.forEach(data.features, function (feature) {
                    feature.visible = true;
                }), $scope.sort);

                //$scope.features = _.clone(features);
                insertFeatures(features, true);
                $scope.categories = data.categories;
                $scope.browsers = data.browsers;
                $scope.featureStatus = data.ieVersions;
                $scope.loading = false;
                $scope.limit = features.length;
            });
    });