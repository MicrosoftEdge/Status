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
                    $scope.$watch(category, function (newValue, oldValue) {
                        if (!newValue) {
                            return;
                        }

                        selectedOptions = _.sortBy(_.pluck(_.filter(newValue, function (category) {
                            return category.selected;
                        }), 'name'), _.identity);

                        if (oldValue) {
                            $scope.$broadcast('filtersUpdated');
                        }

                    }, true);

                    return function (acum, item) {
                        if (selectedOptions && selectedOptions.length === 0) {
                            acum.push(item);
                        } else if (_.contains(selectedOptions, item[property])) {
                            acum.push(item);
                        } else if (typeof property === 'function') {
                            property(selectedOptions, acum, item);
                        }

                        return acum;
                    };
                };

                var browserFilter = function (selectedBrowser, acum, item) {
                    var add = true;

                    if (!selectedBrowser) {
                        return;
                    }

                    selectedBrowser = _.map(selectedBrowser, function (option) {
                        var optionLowerCase = option.toLowerCase();

                        if (optionLowerCase === 'internet explorer') {
                            optionLowerCase = 'ie';
                        }

                        return optionLowerCase;
                    });

                    var itemBrowsers = item.browsers;

                    _.forEach(selectedBrowser, function (browser) {
                        if (itemBrowsers[browser].status !== 'Shipped') {
                            add = false;
                        }
                    });
                    if (add) {
                        acum.push(item);
                    }
                };

                $scope.filters = {
                    areas: [selectorFilter('categories', 'category')],
                    browsers: [selectorFilter('browsers', browserFilter)],
                    status: [selectorFilter('featureStatus', 'position')]
                };
            }
        };
    });
