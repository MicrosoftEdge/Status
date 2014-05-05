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
                    indevelopment: true,
                    implemented: true
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

                $scope.ieversion = 'iedev';

                var getSelected = function (source) {
                    var targetObject = {};

                    _.forOwn(source, function (value, key) {
                        if (value) {
                            targetObject[key] = value;
                        }
                    });
                    return targetObject;
                };

                var filterFunction = function () {

                        var ieStatuses = getSelected($scope.iestatus);
                        var browsers = getSelected($scope.browsers);
                        var browserStatuses = getSelected($scope.browserstatus);
                        var ieVersion;

                        if ($scope.ieversion !== 'iedev') {
                            var version = $scope.ieversion.replace(/\D+/, '');
                            ieVersion = parseInt(version, 10);
                        } else {
                            ieVersion = 'iedev';
                        }

                        return function (acum, item) {
                            var add;

                            var addIE = false;
                            _.forOwn(ieStatuses, function (value, status) {
                                if (status === 'implemented') {
                                    if ($scope.iestatus.implemented) {
                                        if (item.browsers.ie.prefixed <= ieVersion ||
                                            item.browsers.ie.unprefixed <= ieVersion) {
                                            addIE = true;
                                        }
                                    } else {
                                        addIE = true;
                                    }
                                } else {

                                    if (item.browsers.ie.status === converStatus[status]) {
                                        addIE = true;
                                    }
                                }
                            });

                            var addBrowsers = true;
                            _.forOwn(browsers, function (browserValue, browser) {
                                var addBrowser = false;
                                _.forOwn(browserStatuses, function (statusValue, browserStatus) {
                                    if (item.browsers[browser].status === converStatus[browserStatus]) {
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
            link: function postLink(scope, element) {
                element.on('click', function(evt){
                    evt.stopPropagation();
                });
            }
        };
    }
);
