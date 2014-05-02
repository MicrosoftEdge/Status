angular.module('statusieApp')
    .directive('interopfilter', function () {
        'use strict';
        return {
            templateUrl: '/templates/interopfilter.html',
            restrict: 'E',
            controller: function ($scope) {
                //TODO: I don't like this...
                var converStatus = {
                    notplanned: 'Not currently planned',
                    underconsideration: 'Under Consideration',
                    indevelopment: 'In Development'
                };

                $scope.iestatus = {
                    notplanned: true,
                    underconsideration: true,
                    indevelopment: true
                };
                
                var filterFunction = function () {

                    var ieStatuses = {};

                    _.forOwn($scope.iestatus, function (value, key) {
                        if(value){
                            ieStatuses[key] = value;
                        }
                    });

                    return function (acum, item) {
                        var add;

                        var addIE = false;
                        _.forOwn(ieStatuses, function (value, status) {
                            if (item.browsers.ie.status === converStatus[status]) {
                                addIE = true;
                            }
                        });

                        add = addIE;

                        if (add) {
                            acum.push(item);
                        }

                        return acum;
                    };

                };

                $scope.checkChanged = function () {
                    $scope.$emit('filterupdated', {
                        name: 'interop',
                        filterFunction: filterFunction()
                    });
                };

            },
            link: function postLink(scope, element, attrs) {

            }
        };
    });
