angular.module('statusieApp')
    .directive('filter', function () {
        'use strict';

        return {
            templateUrl: '/templates/filter.html',
            restrict: 'E',
            replace: true,
            controller: function ($scope) {

                //This is the filter used in the dropdown selectors
                var selectorFilter = function (category, property) {
                    var selectedOptions;
                    $scope.$watch(category, function (newValue) {
                        if (!newValue) {
                            return;
                        }

                        selectedOptions = _.sortBy(_.pluck(_.filter(newValue, function (category) {
                            return category.selected;
                        }), 'name'), _.identity);

                        $scope.$broadcast('filtersUpdated');

                    }, true);

                    return function (acum, item) {
                        if (!Array.isArray(acum)) {
                            acum = [];
                        }
                        if (selectedOptions && selectedOptions.length === 0) {
                            acum.push(item);
                        } else if (_.contains(selectedOptions, item[property])) {
                            acum.push(item);
                        }

                        return acum;
                    };
                };

                $scope.filters = {
                    areas: [selectorFilter('categories', 'category')],
                    browsers: [selectorFilter('browsers', 'category')],
                    status: [selectorFilter('featureStatus', 'position')]
                };
            }
        };
    });
