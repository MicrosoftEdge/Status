'use strict';

angular.module('statusieApp')
    .directive('drowpdownfilter', function () {
        return {
            templateUrl: '/templates/dropdownfilter.html',
            restrict: 'E',
            scope: {
                options: '='
            },
            replace: true,
            controller: function ($scope) {
                var selectedOptions = [];
                var options = $scope.options,
                    filters = options.filters,
                    selections = options.selections;

                filters.areas = [];

                var selectorFilter = function (acum, item) {
                    if (!Array.isArray(acum)) {
                        acum = [];
                    }
                    if ($scope.allOptions) {
                        acum.push(item);
                    } else if (_.contains(selectedOptions, item.category)) {
                        acum.push(item);
                    }

                    return acum;
                };

                $scope.allOptions = true;
                filters.areas = [selectorFilter];

                $scope.$watch('allCategories', function (newValue) {
                    if (newValue) {
                        filters.selectedCategories = 0;
                    }else{
                        filters.selectedCategories = selectedOptions.length;
                    }
                });

                $scope.$watch('options.selections', function (newValue) {
                    selectedOptions = _.pluck(_.filter(newValue, function (category) {
                        return category.selected;
                    }), 'name');

                    //We sort the categories so we can optimize the contains in areasFilter
                    //The original list of categories could be already sorted so we don't
                    //have to do this all the time
                    selectedOptions = _.sortBy(selectedOptions, _.identity);

                    filters.selectedCategories = selectedOptions.length;
                }, true);
            },
            link: function postLink(scope, element, attrs) {
                element.find('.dropdown-menu').click(function (evt) {
                    //The dropdown closes automatically on any click, we don't want this
                    evt.stopPropagation();
                });
            }
        };
    });