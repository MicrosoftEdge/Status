angular.module('statusieApp')
    .directive('interopfilter', function () {
        'use strict';
        return {
            templateUrl: '/templates/interopfilter.html',
            restrict: 'E',
            controller: function (Status, $scope) {

                var convertStatus = Status.statuses;

                var select = function (result, key) {
                    result[key] = false;
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


                $scope.ieversion = 'ie8';

                var getSelected = function (source) {
                    var targetObject = {};

                    _.forOwn(source, function (value, key) {
                        if (value) {
                            targetObject[key] = value;
                        }
                    });
                    return targetObject;
                };

                var applyFilters = function () {
                    var filters = _.toArray(arguments);

                    return function (item) {
                        return _.reduce(filters, function (acum, val) {
                            //If a previous filter has failed we don't want to check
                            if (!acum) {
                                return acum;
                            }

                            var add = val(item);
                            return acum && add;
                        }, true);
                    };
                };

                var ieStatusFilter = function (ieStatuses, ieVersion) {

                    return function (item) {
                        //If no selections, ieStatuses is undefined and we shouldn't apply any IE filter, just add it)
                        var addItem = _.keys(ieStatuses).length === 0;
                        _.forOwn(ieStatuses, function (value, status) {
                            if (convertStatus[status] === convertStatus.implemented) {
                                if ($scope.iestatus.implemented) {
                                    if(_.isNaN(item.browsers.ie.prefixed) && item.browsers.ie.unprefixed >= ieVersion){
                                        addItem = true;
                                    }else if(item.browsers.ie.prefixed >= ieVersion){
                                        addItem = true;
                                    }
                                } else {
                                    addItem = true;
                                }
                            } else {
                                if (item.browsers.ie.status === convertStatus[status]) {
                                    addItem = true;
                                }
                            }
                        });

                        return addItem;
                    }
                };

                var interopFilter = function (browserStatuses, browsers) {

                    return function (item) {
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

                        return addBrowsers;
                    };
                };

                var getIEVersion = function(){
                    var ieVersion;
                    if ($scope.ieversion !== 'iedev') {
                        var version = $scope.ieversion.replace(/\D+/, '');
                        ieVersion = parseInt(version, 10);
                    } else {
                        ieVersion = 'iedev';
                    }

                    return ieVersion;
                };

                $scope.browsersDisabled = true;

                var filterFunction = function () {
                    var ieStatuses = getSelected($scope.iestatus);
                    var browsers = getSelected($scope.browsers);
                    var browserStatuses = getSelected($scope.browserstatus);
                    var ieVersion = getIEVersion();
                    var processItem = applyFilters(ieStatusFilter(ieStatuses, ieVersion), interopFilter(browserStatuses, browsers));

                    $scope.browsersDisabled = _.keys(browserStatuses) === 0;

                    return function (acum, item) {

                        if (processItem(item)) {
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
