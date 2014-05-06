angular.module('statusieApp')
    .directive('interopfilter', function () {
        'use strict';
        return {
            templateUrl: '/templates/interopfilter.html',
            restrict: 'E',
            controller: function (Status, $scope) {

                var convertStatus = Status.statuses;

                var select = function (result, key) {
                    result[key] = true;
                    return result;
                };

                $scope.iestatus = _.reduce(['notplanned',
                    'underconsideration',
                    'indevelopment',
                    'implemented'], select, {});


                $scope.browserstatus = _.reduce(['notsupported',
                    'indevelopment',
                    'implemented'], select, {});


                $scope.browsers = _.reduce(['chrome',
                    'firefox',
//                    'opera',
                    'safari'], select, {});


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
                            if (convertStatus[status] === convertStatus.implemented) {
                                if ($scope.iestatus.implemented) {
                                    if (ieVersion === 'iedev' && (item.browsers.ie.status === convertStatus.shipped ||
                                        item.browsers.ie.status === convertStatus.prefixed)) {
                                        addIE = true;
                                    } else if (item.browsers.ie.prefixed <= ieVersion ||
                                        item.browsers.ie.unprefixed <= ieVersion) {
                                        addIE = true;
                                    }
                                } else {
                                    addIE = true;
                                }
                            } else {
                                if (item.browsers.ie.status === convertStatus[status]) {
                                    addIE = true;
                                }
                            }
                        });

                        //No need to keep processing, we can return
                        if (!addIE) {
                            return acum;
                        }

                        var addBrowsers = true;
                        _.forOwn(browsers, function (browserValue, browser) {
                            var addBrowser = false;
                            _.forOwn(browserStatuses, function (statusValue, browserStatus) {
                                if (item.browsers[browser].status === convertStatus[browserStatus]) {
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
                element[0].querySelector('.dropdown-menu').addEventListener('click', function (evt) {
                    evt.stopPropagation();
                });
            }
        };
    }
);
