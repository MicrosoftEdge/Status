angular.module('statusieApp')
    .directive('termfilter', function () {
        return {
            templateUrl: '/templates/termfilter.html',
            restrict: 'E',
            replace: true,
            controller: function ($location, $scope) {
                'use strict';

                var search = $location.search();

                var filter = function () {
                    $scope.$emit('filterupdated', {
                        name: 'interop',
                        filterFunction: filterFunction($scope.term)
                    });
                };

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

                if(search['term']){
                    $scope.term = search['term'];
                }

                $scope.termChange = filter;
            }
        };
    });
