'use strict';

angular.module('statusieApp')
    .directive('areafilter', function () {
        return {
            templateUrl: '/templates/areafilter.html',
            replace: true,
            restrict: 'E',
            controller: function ($scope) {
                var selectedCategories = [];
                $scope.filters.areas = [];

                var areasFilter = function (acum, item) {
                    if (!Array.isArray(acum)) {
                        acum = [];
                    }
                    if ($scope.allCategories) {
                        acum.push(item);
                    } else if (_.contains(selectedCategories, item.category)) {
                        acum.push(item);
                    }

                    return acum;
                };

                $scope.allCategories = true;
                $scope.filters.areas = [areasFilter];

                $scope.$watch('allCategories', function (newValue) {
                    if (newValue) {
                        $scope.filters.selectedCategories = 0;
                    }
                });

                $scope.$watch('categories', function (newValue) {
                    selectedCategories = _.pluck(_.filter(newValue, function (category) {
                        return category.selected;
                    }), 'name');

                    //We sort the categories so we can optimize the contains in areasFilter
                    //The original list of categories could be already sorted so we don't
                    //have to do this all the time
                    selectedCategories = _.sortBy(selectedCategories, _.identity);

                    $scope.filters.selectedCategories = selectedCategories.length;
                }, true);
            },
            link: function postLink(scope, element, attrs) {
//                element.text('this is the areaFilter directive');
            }
        }
            ;
    })
;
