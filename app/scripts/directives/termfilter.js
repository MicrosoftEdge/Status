angular.module('statusieApp')
    .directive('termfilter', function () {
        return {
            templateUrl: '/templates/termfilter.html',
            restrict: 'E',
            replace: true,
            controller: function ($location, $scope) {
                'use strict';

                var filterFunction = function (term) {
                    return function (acum, item) {
                        if(_.isUndefined(term) || term === ''){
                            $location.search('term', null);
                            acum.push(item);
                            return acum;
                        }

                        $location.search('term', term);

                        var termRegex = new RegExp(term, 'gi');

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
