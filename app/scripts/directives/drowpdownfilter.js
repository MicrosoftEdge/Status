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
                'use strict';

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

                $scope.stopPropagation = function (evt) {
                    $event.stopProgation();
                };

                $scope.selectAll = function (evt) {
                    if (evt.target.tagName.toLowerCase() === 'input') {
                        $scope.allOptions = !$scope.allOptions;
                    }
                    evt.stopPropagation();
                };
            },
            link: function postLink(scope, element, attrs) {
                element.find('.dropdown-menu').on('click', 'li.dynamic-option', function (evt) {

                    scope.$apply(function () {
                        if (scope.allOptions) {
                            scope.allOptions = false;
                        }
                    });

                    evt.stopPropagation();
                });

                element.find('.dropdown-menu').on('click', 'li.dynamic-all', function (evt) {

                    scope.$apply(function () {
                        scope.allOptions = !scope.allOptions;
                        if(scope.allOptions){
                            _.forEach(scope.options.selections, function(option){
                                option.selected = false;
                            });
                        }
                    });

                    evt.stopPropagation();
                });

//                element.find('.dropdown-menu').click(function (evt) {
//                    //The dropdown closes automatically on any click, we don't want this
//                    evt.stopPropagation();
//                });
            }
        };
    });