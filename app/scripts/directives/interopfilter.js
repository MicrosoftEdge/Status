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
                    indevelopment: 'In Development',
                    notsupported: 'Not Supported',
                    shipped: 'Shipped',
                    implemented: 'Shipped'
                };

                $scope.iestatus = {
                    notplanned: true,
                    underconsideration: true,
                    indevelopment: true
                };

                $scope.browserstatus = {
                    notsupported: true,
                    indevelopment: true,
                    implemented: true
                };

                $scope.browsers = {
                    chrome: true,
                    firefox: true,
                    safari: true,
                    opera: true
                };

                var getSelected = function(targetObject){
                    return function(value, key){
                        if(value){
                            targetObject[key] = value;
                        }
                    };
                };

                var filterFunction = function () {

                    var ieStatuses = {};
                    var browsers = {};
                    var browserStatuses = {};

                    _.forOwn($scope.iestatus, getSelected(ieStatuses));
                    _.forOwn($scope.browsers, getSelected(browsers));
                    _.forOwn($scope.browserstatus, getSelected(browserStatuses));

                    return function (acum, item) {
                        var add;

                        var addIE = false;
                        _.forOwn(ieStatuses, function (value, status) {
                            if (item.browsers.ie.status === converStatus[status]) {
                                addIE = true;
                            }
                        });

                        var addBrowsers = true;
                        _.forOwn(browsers, function (browserValue, browser) {
                            var addBrowser = false;
                            _.forOwn(browserStatuses, function(statusValue, browserStatus ){
                                if(item.browsers[browser].status ===  converStatus[browserStatus]){
                                    addBrowser = true;
                                }
                            });
                            addBrowsers = addBrowsers && addBrowser;
                        });

                        add = addIE && addBrowsers;

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
