angular.module('statusieApp')
    .directive('termfilter', function () {
        return {
            templateUrl: '/templates/termfilter.html',
            restrict: 'E',
            replace: true,
            controller: function ($scope) {
                'use strict';

                var filterFunction = function (term) {
                    return function (acum, item) {
                        if(_.isUndefined(term) || term === ''){
                            acum.push(item);
                            return acum;
                        }

                        var termRegex = new RegExp(term.text, 'gi');

                        if (termRegex.test(item.name) || termRegex.test(item.summary)) {
                            acum.push(item);
                        }

                        return acum;
                    };
                };

                $scope.termChange = function(){
                    $scope.$emit('filterupdated', {
                        name: 'term',
                        filterFunction: filterFunction($scope.term)
                    });
                };
            }
        };
    });
