'use strict';

angular.module('statusieApp')
    .directive('drowpdownfilter', function () {
        return {
            templateUrl: '/templates/dropdownfilter.html',
            restrict: 'E',
            scope: {
                options: '='
            },
            priority: 10,
            replace: true,
            controller: function ($scope) {

                $scope.$watch('options.selections', function (newValue, oldValue) {
                    if (!newValue) {
                        return;
                    }

                    if (newValue && !oldValue) {
                        //We need to assign it at this moment because if not the dropdown is not populated
                        $scope.selections = newValue;
                        $scope.allOptions = true;
                    }
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