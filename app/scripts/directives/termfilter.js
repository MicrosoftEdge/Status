'use strict';

angular.module('statusieApp')
    .directive('termfilter', function () {
        return {
            templateUrl: '/templates/termfilter.html',
            restrict: 'E',
            replace: true,
            controller: function ($scope) {
                var filters = $scope.filters;
                $scope.terms = [];

                var filterFunction = function (term){
                    return function (acum, item){
                        var termRegex = new RegExp(term, 'gi');

                        if(termRegex.test(item.name) || termRegex.test(item.summary)){
                            acum.push(item);
                        }

                        return acum;
                    };
                };

                $scope.addTerm = function () {
                    var term = $scope.inputTerm;

                    if(term === ''){
                        return;
                    }

                    if (!Array.isArray(filters.terms)) {
                        filters.terms = [];
                    }

                    $scope.terms.push({
                        text: term
                    });

                    filters.terms.push(filterFunction(term));

                    $scope.inputTerm = '';
                    $scope.$broadcast('filtersUpdated');
                };

                $scope.removeTerm = function (term) {
                    var index = $scope.terms.indexOf(term);
                    $scope.terms.splice(index, 1);
                    var newFilters = _.map($scope.terms, function(term){
                        return filterFunction(term);
                    });

                    filters.terms = newFilters;
                    $scope.$broadcast('filtersUpdated');
                }
            },
            link: function postLink(scope, element, attrs) {
//        element.text('this is the termFilter directive');
            }
        };
    });
